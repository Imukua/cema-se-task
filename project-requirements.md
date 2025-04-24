# Product Requirements Document (PRD) – Basic Health Information System

## Product Overview
The **Basic Health Information System (HIS)** is a tool for doctors to manage client information and health programs (e.g., TB, Malaria, HIV). It allows for:
- Client registration
- Program enrollment
- Profile viewing
- API exposure of client data

## Objectives
- Simplify program and client management for doctors.
- Enable program-client linkage.
- Provide API access to client data for external systems.
- Demonstrate clean software engineering practices.

## Core Features

| Feature                   | Description                                                             |
|--------------------------|-------------------------------------------------------------------------|
| Create Health Program    | Ability to add new health programs (e.g., HIV, Malaria).                |
| Register Client          | Register a client with personal info (name, age, ID, contact).          |
| Enroll Client in Programs| Link clients to one or multiple health programs.                        |
| Search Clients           | Search clients by name, ID, or contact.                                 |
| View Client Profile      | Display client details and enrolled programs.                           |
| API Access to Client Profile | RESTful API endpoint to retrieve a client's profile.               |

## Optional Features (Nice-to-Haves)
- Basic authentication for API
- Search by partial name match
- Pagination for client list
- Timestamps for enrollments

## Non-Functional Requirements
- Clean, documented code
- Well-structured commit history
- `README` with setup and usage instructions
- PowerPoint describing approach and design
- Optional: tests, deployed API, security features

## Success Metrics
- Functional demo of core features
- Easy-to-follow
