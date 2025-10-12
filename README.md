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
**Hephaestus** is a personal project designed to help users make informed decisions about household appliances. The application evaluates the condition and damage of the appliance and provides a recommendation on what action to take. 

The project consists of two components:
 - Frontend built with Angular ( **you are here 📍** )
 - Backend developed using Java

The frontend application is deployed on **GitHub Pages** and is accessible here:

- **[Live Application](https://cristeaibogdan.github.io/hephaestus-web/)**  
  Access the live version of the Hephaestus application, where you can interact with the user interface and make informed appliance decisions.
  
  **⚠️ Backend is hosted on Azure with a burst configuration, which means it may temporarily shut down when idle. Please wait for the initialization process to complete.**

- **[Zipkin Server on Azure](https://zipkin.kindmeadow-812476e6.northeurope.azurecontainerapps.io)**  
  Access Zipkin to monitor requests in real-time and trace how the frontend interacts with the backend.

<div align="center">
   <img src="src\assets\images\Application.gif" >
</div>

## Technologies Used
* **Angular 20** - The frontend was written in Angular 20, a framework for building efficient single-page applications (SPAs).
* **Angular Material** - Offers a set of reusable UI components based on Material Design. Used to enhance the user interface with a modern look and feel.
* **Reactive Forms** - Facilitates handling of form inputs and validations through a reactive programming approach.
* **Custom Sync Validators** - Implemented to enforce business logic and ensure that form data meets specific requirements.
* **Custom Async Validators** - Used for backend validation, allowing asynchronous checks on form inputs against server data.
* **Interceptors** - Used for: set header for the selected language, display loading indicator and set a predefined timeout to each request.
* **ZXing** - A library for scanning and decoding barcodes and QR codes.
* **Transloco** - Supports internationalization, making the application adaptable for various languages.

## Local Deployment

### Requirements
To run the frontend locally, ensure that you have the following:

* [Backend deployed with Docker](https://github.com/cristeaibogdan/hephaestus-api/blob/main/README.md)
* Visual Studio Code (VSC)
* Node.js
* npm
* Angular CLI 20

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
If spans from the frontend fail to reach Zipkin, you may encounter an error like this in the browser console:
```
POST <some endpoint> net::ERR_BLOCKED_BY_CLIENT
```
This issue is often caused by AdBlock or similar browser extensions blocking telemetry requests.

**Solution:**

Disable AdBlock (or similar extensions) for the following URL:
 ```https://cristeaibogdan.github.io/hephaestus-web```

***