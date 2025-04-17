# NexusOps - Frontend Documentation

This document provides comprehensive documentation for the frontend system of the NexusOps company management application. It covers key aspects including requirements, setup procedures, user flows, and security considerations.

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. High-Level Architecture](#2-high-level-architecture)
- [3. Requirements](#3-requirements)
  - [3.1 Runtime Environment](#31-runtime-environment)
  - [3.2 Environment Variables](#32-environment-variables)
- [4. Setup and Running](#4-setup-and-running)
- [5. Core Libraries & Utilities](#5-core-libraries--utilities)
  - [5.1 React & React Router](#51-react--react-router)
  - [5.2 TailwindCSS & ShadCN](#52-tailwindcss--shadcn)
  - [5.3 TypeScript](#53-typescript)
- [6. User Flow](#6-user-flow)
  - [6.1 Sign In Page](#61-sign-in-page)
  - [6.2 Sign Up Page](#62-sign-up-page)
    - [6.2.1 Employee Sign Up Page](#621-employee-sign-up-page)
    - [6.2.2 Owner Sign Up Page](#622-owner-sign-up-page)
  - [6.3 Home Page](#63-home-page)
  - [6.4 Schedule Page](#64-schedule-page)
    - [6.4.1 Employee View](#641-employee-view)
    - [6.4.2 Leader & Owner View](#642-leader--owner-view)
  - [6.5 Training Page](#65-training-page)
    - [6.5.1 Employee View](#651-employee-view)
    - [6.5.2 Leader View](#652-leader-view)
- [6.6 Help Page](#66-help-page)
- [6.7 User Management Page](#67-user-management-page)

## 1. Introduction

This document details the frontend system for the **NexusOps** company management application. It provides essential information for developers regarding setup, requirements, and user flow.

## 2. High-Level Architecture

The overall system follows a standard web service architecture comprising a client frontend, an Express backend application, a PostgreSQL database for primary data storage, and Supabase for handling authentication and file storage.

- **Client/Frontend:** Interacts with the backend via REST API calls.
- **NexusOps Express Backend:** The core application built with Express.js, responsible for handling business logic, API routing, database interactions, and authentication orchestration.

## 3. Requirements

### 3.1 Runtime Environment

- **Node.js / Bun:** The frontend application is developed using TypeScript and can be run with either Node.js or Bun.
- **TypeScript:** Version ^5.0.0 or compatible.

### 3.2 Environment Variables

The following variables must be configured (typically in a `.env` file):

| Variable                       | Description                                          | Example                              |
| :----------------------------- | :--------------------------------------------------- | :----------------------------------- |
| `VITE_SUPABASE_URL`            | Your Supabase project URL.                           | `https://your-project-ref.supabase.co` |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (for admin operations). | `eyJ...`                             |
| `VITE_API_URL`                 | The URL for the backend API.                         | `http://localhost:3000`              |
| `PORT` (Optional)              | The port the server should run on (defaults to `5173`).| `8080`                               |

## 4. Setup and Running

1.  **Clone:** Obtain the repository code by cloning it.
2.  **Install:** Run `bun install` or `npm install` to install dependencies.
3.  **Environment:** Create a `.env` file and populate it with the required [Environment Variables](#32-environment-variables).
4.  **Build:** Run `bun run build` to generate the static files for the web application.
5.  **Run:** Execute `bun run start` to launch the built application.

## 5. Core Libraries & Utilities

### 5.1 React & React Router

The application is built using React, a popular JavaScript framework. While React is excellent for building Single Page Applications (SPAs), it requires a routing library for navigation. React Router provides a robust set of tools to enable effective client-side routing.

### 5.2 TailwindCSS & ShadCN

Both a pleasant User Experience (UX) and an efficient Developer Experience (DX) are crucial. TailwindCSS facilitates styling by providing utility classes that allow for rapid custom design implementation. This approach makes styling both easier and faster.

ShadCN is a collection of highly customizable UI components. It's important to note that it's not a traditional component library; individual components can be downloaded and modified to suit specific needs. Utilizing ShadCN's prebuilt components significantly accelerated the development process, enabling the team to focus on perfecting the application's logic rather than reinventing common UI elements.

### 5.3 TypeScript

For an application of this scale, managing data integrity and structure is vital. Therefore, the adoption of TypeScript was essential. The use of types and interfaces not only streamlined the development process and made it more enjoyable but also resulted in more robust code less prone to errors caused by incorrect data types.

## 6. User Flow

This section provides a detailed description of each key page within the web application. All routes within these sections are protected, requiring users to be authenticated to access them. A consistent navbar is displayed on all these pages, with navigation links tailored based on the role of the currently signed-in user.

### 6.1 Sign In Page

All pages within the application, except for the [Sign In](#61-sign-in-page) and [Sign Up](#62-sign-up-page) pages, are protected and require authentication. This is the first page an unauthenticated user will encounter. It features a simple form allowing users to identify themselves and log in using their credentials (email and password). The page also includes a link to redirect users to the [Sign Up](#62-sign-up-page) page if they don't have an account. Users who are already logged in will be automatically redirected to the [Home](#63-home-page) page.

The form incorporates client-side validation, ensuring that requests are only sent to the API if the form data is valid, thus preventing unnecessary calls. The API can also return validation errors, which are associated with specific fields.

Upon successful authentication, a success message is displayed via a toast notification, and the user is redirected to the [Home](#63-home-page) page. If the login attempt is unsuccessful, an error toast is shown, and in the case of validation errors, specific error messages are displayed next to the relevant form fields.

### 6.2 Sign Up Page

Users can navigate to these pages via the link provided on the [Sign In](#61-sign-in-page) page. There are two distinct views catering to two types of registrations: employee and owner registration. The employee view is displayed by default. Users who are already logged in will be redirected to the [Home](#63-home-page) page.

Client-side form validation is implemented, ensuring that requests are only sent to the API when the form is valid, minimizing unnecessary API calls. The API can also return validation errors associated with specific fields.

Following a successful registration, a success toast notification appears, and the user is redirected to the [Sign In](#61-sign-in-page) page. If registration fails, an error toast is shown, and validation errors are displayed next to the relevant form fields.

#### 6.2.1 Employee Sign Up Page

This page contains a simple form for registering a new employee account. Each employee must provide their name, email address, and password. A user can only register one account linked to a single company. They are required to enter their company's unique 8-character code in the final input field. This serves as a security measure to ensure employees can only register accounts within their designated company.

#### 6.2.2 Owner Sign Up Page

This page presents a simple form for registering a new owner account. An owner must provide their name, email address, and password. Owners are also required to register their company as part of their account registration process, so they must additionally provide their company's name in the final input field.

### 6.3 Home Page

This page serves as the initial landing point for all authenticated users. It welcomes the user and provides navigation access to other pages via the navbar.

### 6.4 Schedule Page

The schedule page is one of the application's most crucial features. It incorporates significant logic to facilitate efficient management of work shifts. The page features a table with 7 columns representing the days of the week and 24 rows representing the hours of the day. Each table cell displays data that varies depending on the user's role.

Users can navigate between weeks using the navigation buttons located in the top left corner. Work shifts can be filtered by their type (paid or unpaid) using the select input field next to the "Add" button in the top right corner. The "Add" button allows users to create new work shifts.

#### 6.4.1 Employee View

Employees are only able to view their own shifts. By default, cells are empty. However, if an employee has a work shift at a specific time, the corresponding cells are marked by displaying the start of each hour included in the shift. Clicking on one of these cells opens a modal displaying the details of that work shift, and provides an option to edit it. Changes can be saved by clicking the "Save" button. The modal can be closed without saving changes by clicking the "Cancel" button, the close button in the top right corner, or simply by clicking outside the modal area.

By clicking the "Add" button, employees can request new work shifts. A modal appears, prompting them to provide the start and end dates/times of the work shift, and its type. Paid shifts represent actual work periods, while unpaid shifts are used to request time off. These requests are then subject to finalization by Leaders or Owners.

#### 6.4.2 Leader & Owner View

Leaders and Owners have visibility into all work shifts. Cells are empty by default. However, if a work shift exists at a specific hour, the hour is displayed along with the number of work shifts scheduled for that hour. For efficiency, initially, only the count of shifts is requested. More detailed information can be viewed by clicking on a cell. Clicking on a cell opens a modal containing a table listing all work shifts for that hour. Each row in the table shows the employee's name, and the start and end dates/times of the work shift. Clicking the three dots icon reveals a popup menu allowing users to finalize these work shifts. By selecting multiple entries, they can finalize multiple shifts simultaneously.

Clicking the "Add" button allows Leaders and Owners to create new work shifts. A modal appears, where they can specify the start and end dates/times for the shift, and its type (paid for work, unpaid for time off). A search field is available to find and assign users to the new work shift. Results appear as they type names, and clicking on an employee adds them to the selected shift.

### 6.5 Training Page

Providing training for employees is essential. The training page is dedicated solely to this purpose. Leaders can create tests, and employees can complete these tests to reinforce their knowledge and undergo training. Different views are presented based on user roles.

#### 6.5.1 Employee View

Employees can view all available training tests on the main training page. These are presented as cards, each displaying the test title and description, as well as its status. If a test has been completed at least once, a three dots icon is visible. Clicking this icon allows the user to view their results for that test. Clicking on a test card redirects the user to the page where they can take the test.

On a specific test page, the employee can see the test's title and description and has the option to download the associated attachment. This attachment contains the necessary training material, and the test questions will be based on its content. Once the employee feels they have sufficiently learned, they can start the test. This action removes the download option and displays the questions. Questions can have single or multiple correct answers, and all questions must be answered. The completed form can then be submitted. After a successful submission, the user is redirected back to the main training page listing all tests.

The results page for a test mirrors the format of the test-taking page but highlights the correct answers and indicates whether the user answered correctly for each question. A final score is also displayed. Tests can be resubmitted, and each resubmission will overwrite the previous results.

#### 6.5.2 Leader View

Leaders can view all available training tests on the main training page. These are displayed as cards showing the test title, description, and status. If a test has been completed at least once, a three dots icon is present, allowing Leaders to view submission results. Clicking on a test card redirects the Leader to a page detailing all submissions for that specific test. On the main training page, Leaders can also see a table showing a few of the latest test submissions, including the submitter's name, test name, final score, and submission date.

An "Add" button is located in the bottom right corner. Clicking this button allows Leaders to create a new test. A simple form requires the user to provide the test's name and description, specify the user role(s) that can access it, and upload a PDF file (under 5MB) which serves as the training material. Files can be uploaded by clicking the file upload field or by dragging and dropping a file onto it. New questions can be added by clicking the "Add question" button. This brings up a new card where the Leader enters the question and potential answers. Each answer includes a checkbox to mark it as correct. At least one answer must be correct, and multiple correct answers are allowed. Each question must have a minimum of two and a maximum of four answer options. Clicking the "Submit" button creates the test, and the Leader is redirected to the main training tests page.

By clicking on one of the test cards, Leaders can view all results for that specific test. A table is displayed listing the submitter's name, the test's title, the final score, and the date of submission for each attempt.

### 6.6 Help Page

A well-designed application includes a page for users to request assistance. The help page serves this purpose, allowing users to seek help from either their company's internal support or from administrators. On this page, a form is available for users to create a new support ticket. They must provide a concise title and a detailed description for the ticket. Employees and Leaders are also required to specify whether they want the ticket assigned to their company or to the administrators. Owners can only assign tickets to administrators. Below the ticket creation form, cards are displayed showing existing tickets with their title, creation date, and an icon indicating the ticket's status (pending or closed). A ticket can be closed by an Owner if it is assigned to the company, or by an Admin if it is assigned to Administrators.

Clicking on a ticket redirects the user to a detailed page where messages can be exchanged between the user who opened the ticket and the assigned Owners or Admins. Once an issue is resolved, the ticket can be closed.

### 6.7 User Management Page

On this page, Leaders and Owners can manage their company's employees. A table is presented displaying key information for each user, including their name, age, hourly wage, role, registration date, and verification status. By clicking the three dots next to a user's entry, a menu appears offering options to verify the employee (if not already verified) or edit their details. Note that only an employee's hourly wage and role can be modified.