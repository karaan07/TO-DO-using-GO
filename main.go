package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

)

type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

func main() {
	fmt.Println("Hello World")

	app := fiber.New()

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	PORT := os.Getenv("PORT")
	// Initialize an empty slice to store todos
	todos := []Todo{}

	// Route to test the server
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(todos)
	})

	// Create a Todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{} // Create an empty Todo object
		if err := c.BodyParser(&todo); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Validate the request body
		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Todo body is required"})
		}

		// Assign an ID to the new todo and append it to the slice
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)

		// Respond with the created todo
		return c.Status(201).JSON(todo)
	})

	// Update a Todo
	app.Patch("/api/todos/:id",func(c *fiber.Ctx) error{
		id := c.Params("id")

		for i , todo := range todos{
			if fmt.Sprint(todo.ID) == id {
				todos[i].Completed = true
				return c.Status(200).JSON(todos[i])
			}
		}
		return c.Status(404).JSON(fiber.Map{"error":"Todo not Found"})
	})

	//Delete a Todo

	app.Delete("/api/todos/:id",func (c *fiber.Ctx) error {
		id := c.Params("id")
		for i, todo := range todos{
			if fmt.Sprint(todo.ID) == id {
				todos = append(todos[:i], todos[i+1:]...)
				return c.Status(200).JSON(fiber.Map{"success": "true"})
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Todo not Found"})
	})
		
	

	// Start the server and listen on port 4000
	log.Fatal(app.Listen(":"+PORT))
}
