# Flexible Product Catalog - API 🗄️

## Description

This project is a Flexible Product Catalog API. It's designed to provide a robust and flexible solution for managing a product catalog in an e-commerce context. The API allows for the creation, retrieval, updating, and deletion of products. Each product can have a variety of custom attributes, making this API adaptable to a wide range of product types and industries.

The API is built with Node.js and uses MongoDB for data storage, providing high performance and scalability. It also includes a comprehensive test suite to ensure reliability and correctness. This project is perfect for developers looking for a ready-to-use, flexible product catalog solution for their e-commerce applications.

## Installation

Before you start, make sure you have Docker and Node.js installed on your machine.

1. Clone this repository:

```bash
git clone https://github.com/username/projectname.git
```

2. Navigate into the project directory:

```bash
cd projectname
```

3. Setup env file:

This project uses environment variables for configuration. These are stored in a `.env` file at the root of the project.

Copy the `.env.example` file and rename it to `.env`:

```bash
cp .env.example .env
```

4. Start container via docker compose with:

```sh
docker-compose up [-d] [--build]
```

5. Api is now responding on http://localhost:{PORT}. Replace {PORT} with the port number you specified in your .env file.

## Running Test

This project uses Docker for running tests in an isolated environment. The configuration for the test environment is in the `docker-compose.test.yml` file.

To run the tests, follow these steps:

1. Setup env file:

This project already ships with a configured .env.test file, but you can adjust it if needed.

2. Build the test environment:

```bash
docker-compose -f docker-compose.test.yml build
```

3. Run the tests:

```bash
docker-compose -f docker-compose.test.yml up --exit-code-from api
```
