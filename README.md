# UFirst Homework

This repository contains:

- a [backend node JS server](importer) to parse some EPA server access logs into a clean JSON format; and
- a frontend JS app which consumes the JSON and visualises it in four distinct diagrams.

The application is hosted at https://ufirst.stanrogo.com/.

## Backend - Importer

The backend is built using NodeJS using Express. The code targets node version 10.24.1 due to issues with the server on which the application runs.

### API

There is one API route available which returns a JSON file of the [epa-http.txt](importer/epa-http.txt) file in the necessary format.

- **URL** - /epa
- **Method** - `GET`
- **URL Params** - none
- **Data Params** - none
- **Success Response** - 200 OK [{}, ..., {}]

Since the assignment required it, a JSON file is generated which is then reused for subsequent requests.

## Frontend - Visualisation

The frontend uses d3 js to visualise the server logs using a variety of charts.

## Devops / Infrastructure

This project has been deployed using Github actions to:

- build the frontend and upload it via rsync to a remote server; and
- rsync the backend to the remote server, install dependecies and run application via ssh.

Webpack is used to ensure an easy development and production environment split.
Babel has *not* been used as the latest version of edge supports all desired features without requiring transpilation.
