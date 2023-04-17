package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Time time.Time

type User struct {
	gorm.Model
	ID            uint   `json:"id"`
	Username      string `json:"username"`
	Password      string `json:"password"`
	Address       string `json:"address"`
	Phone_number  string `json:"phone_number"`
	Email_address string `json:"email_address"`
	Date_of_birth string `json:"date_of_birth"`
}

func main() {
	store := session.New(session.Config{Expiration: 3 * 24 * time.Hour})
	p := &params{
		memory:      64 * 1024,
		iterations:  1,
		parallelism: 1,
		saltLength:  16,
		keyLength:   32,
	}

	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("[ERROR] Couldn't establish connection with DB.")
	}

	db.AutoMigrate(&User{})

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "",
		AllowCredentials: true,
	}))

	// login struct:
	type Login struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	app.Post("/login", func(c *fiber.Ctx) error {

		// Get session from storage
		sess, _ := store.Get(c)

		var login_user Login
		err := json.Unmarshal(c.Body(), &login_user)
		if err != nil || login_user.Password == "" || login_user.Username == "" {
			fmt.Println(err)
			c.SendString("[ERROR] Couldn't receive valid login credentials.\nField username or password may be empty.")
			return c.SendStatus(400)
		}
		var cmp_user User // user to compare with
		result := db.First(&cmp_user, "username = ?", login_user.Username)
		if result.RowsAffected == 0 {
			c.SendString("[ERROR] Couldn't find user")
			// TODO: check if status codes are correct
			return c.SendStatus(401)
		}

		match, err := comparePasswordAndHash(login_user.Password, cmp_user.Password)
		if err != nil {
			c.SendString("[ERROR] Couldn't compare passwords")
			return c.SendStatus(500)
		}
		switch match {
		case true:

			sess.Set("userId", cmp_user.ID)
			if err := sess.Save(); err != nil {
				c.SendString("[ERROR] Couldn't create a user session.")
				return c.SendStatus(500)
			}
			c.SendString("Success.")
			return c.SendStatus(200)
		case false:
			c.SendString("[ERROR] Incorrect Password.")
			return c.SendStatus(401)
		}
		// should be unreachable
		c.SendString("[ERROR] unkown error")
		return c.SendStatus(500)
	})

	type Register struct {
		// TODO: find a way to avoid creating multiple structs for the same data type
		// id, dates ignored, they should be added by the db
		Username      string `json:"username"`
		Password      string `json:"password"`
		Address       string `json:"address"`
		Phone_number  string `json:"phone_number"`
		Email_address string `json:"email_address"`
		Date_of_birth string `json:"date_of_birth"`
	}
	app.Get("/me", func(c *fiber.Ctx) error {
		sess, _ := store.Get(c)
		var user User
		db.First(&user, "id = ?", sess.Get("userId"))
		return c.JSON(User{Username: user.Username, ID: user.ID})

	})

	app.Post("/register", func(c *fiber.Ctx) error {
		var r Register
		err := json.Unmarshal(c.Body(), &r)
		if err != nil || r.Password == "" || r.Username == "" {
			fmt.Println(err)
			c.SendString("[ERROR] Couldn't receive valid register credentials.\nField username, password or email address may be empty.")
			return c.SendStatus(400)
		}
		var user User
		result := db.Find(&user, "username = ?", r.Username)
		if result.RowsAffected > 0 {
			c.SendString("[ERROR] username exists already")
			return c.SendStatus(400)
		}

		encodedHash, err := generateFromPassword(r.Password, p)

		if err != nil {
			c.SendString("[ERROR] Couldn't hash password correctly.")
			return c.SendStatus(500)
		}

		create_result := db.Create(&User{Username: r.Username, Password: encodedHash, Email_address: r.Email_address,
			Address: r.Address, Phone_number: r.Phone_number, Date_of_birth: r.Date_of_birth})
		if create_result.RowsAffected == 1 {
			sess, _ := store.Get(c)

			db.First(&user, "username = ?", r.Username)
			sess.Set("userId", user.ID)
			if err := sess.Save(); err != nil {
				c.SendString("[ERROR] Couldn't create a user session.")
				return c.SendStatus(500)
			}
			c.SendStatus(200)
			return c.SendString("Success.")
		} else {
			c.SendStatus(500)
			return c.SendString("[ERROR] Unkown error.")
		}

	})

	app.Get("/user/:username", func(c *fiber.Ctx) error {
		var user User
		result := db.First(&user, "username = ?", c.Params("username"))
		if result.RowsAffected == 0 {
			c.Status(404)
			return c.JSON("[ERROR] couldn't find user.")
		} else {
			c.Status(200)
			return c.JSON(user)
		}
	})

	app.Get("/logout", func(c *fiber.Ctx) error {
		sess, _ := store.Get(c)
		sess.Destroy()
		return c.SendStatus(200)
	})

	app.Patch("/settings", func(c *fiber.Ctx) error {
		var updated_user User
		err := json.Unmarshal(c.Body(), &updated_user)
		if err != nil {
			fmt.Println(err)
			c.SendString("[ERROR] Unkown error.")
			return c.SendStatus(400)
		}
		if updated_user.Username != "" {
			var temp_user User
			// ideally you should check the email address as well (can't be bothered right now)
			if db.Find(&temp_user, "username = ?", updated_user.Username).RowsAffected > 0 {
				c.Status(400)
				return c.SendString("[ERRROR] username taken.")
			}
		}

		var user User

		result := db.Find(&user, "id = ?", updated_user.ID)
		if result.RowsAffected == 0 {
			c.Status(500)
			return c.SendString("[ERROR] user does not exist.")
		}

		r := db.Model(&user).Updates(User{
			Username:      updated_user.Username,
			Address:       updated_user.Address,
			Phone_number:  updated_user.Phone_number,
			Date_of_birth: updated_user.Date_of_birth,
			Email_address: updated_user.Email_address,
		})

		if r.RowsAffected == 0 {
			c.Status(500)
			return c.SendString("[ERROR] unkown error")
		} else {
			c.Status(200)
			return c.SendString("Success.")
		}
	})
	app.Listen(":8000")
}
