<div align="center">
   <img width="450" src="src\assets\logos\hephaestus-logo.png" >
</div>

<div align="center">

   [Requirements](#requirements) | 
   [Usage](#usage) | 
   [Important URLs](#important-urls) |
   [Possible problems](#possible-problems)

</div>

## What Does This Project Do?
`Hephaestus` is a personal project designed to help users make informed decisions about household appliances. The application evaluates the condition and damage of the appliance and provides a recommendation on what action to take. 

The frontend application is deployed on GitHub Pages and is accessible here:

- **Live Application**: [Hephaestus on GitHub Pages](https://cristeaibogdan.github.io/hephaestus-web/)

Additionally, a **Zipkin server** is available to monitor and trace requests. You can access it here:

- **Zipkin Server**: [Zipkin on Render](https://zipkin-f3xe.onrender.com/zipkin/)

The project consists of two components:
 - Frontend built with Angular ( **you are here 📍** )
 - Backend developed using Java

<div align="center">
   <img src="src\assets\images\Application.gif" >
</div>

## Technologies Used
* **Angular 15** - The frontend is written in Angular 15, a framework for building efficient single-page applications (SPAs).
* **Angular Material** - Offers a set of reusable UI components based on Material Design. Used to enhance the user interface with a modern look and feel.
* **Reactive Forms** - Facilitates handling of form inputs and validations through a reactive programming approach.
* **Custom Sync Validators** - Implemented to enforce business logic and ensure that form data meets specific requirements.
* **Custom Async Validators** - Used for backend validation, allowing asynchronous checks on form inputs against server data.
* **Interceptor** - Displays error messages from the backend, using the user's selected language.
* **ZXing** - A library for scanning and decoding barcodes and QR codes.
* **i18n** - Supports internationalization, making the application adaptable for various languages and regions.

## Local Deployment

### Requirements
* Visual Studio Code (VSC)
* Node.js
* npm
* Angular CLI 15

### Usage
1. Clone the repository:
```bash
git clone https://github.com/cristeaibogdan/hephaestus-web.git
```
2. Install dependencies:
```
npm install
```
3. Start the application
```
npm start
```

### Important URLs
- [Application](http://localhost:4200) - `localhost:4200`

## Possible problems
* None I am aware of ...

***