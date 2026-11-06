# Eventim Frontend Test

Welcome to the Eventim frontend test for new hires. The purpose of this test is to build a React UI that integrates with the backend API.

## Tech Stack

- Node 22
- React 18 + TypeScript
- Vite
- MUI (Material UI v5)
- Redux Toolkit
- Formik + Yup

MUI, Redux Toolkit, Formik, and Yup are already installed — no need to add them.

## Setup

See the [root README](../../README.md) for running the project (with and without Nix) and the QA process.

## Tasks

### 1. Events list with pagination

Consume `GET /events` from the backend and display the list of events with pagination controls (the backend supports page and page size parameters). Each event should show its relevant information.

- Use MUI components to build the UI
- The layout should be responsive
- Use Redux to manage the events state and pagination state

### 2. Settings form

Build a form that reads and updates a settings object via the backend API (`GET /settings` and `POST /settings`).

- Use MUI components to build the form
- The layout should be responsive
- Use Redux to manage the settings state
- Use Formik for the form and Yup for validation

### 3. Code quality

Review the existing frontend code before submitting. If you find anything you would change or improve, do it. In your pull request description, explain what you changed and why.

### 4. Tests

All new components and Redux logic must have unit tests. A testing library is not pre-installed — choose one, integrate it, and use it.
