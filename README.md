# Shopping List App

---

## Overview

A simple and responsive **Shopping List web application** built with **React**, **TypeScript**, and **Redux**, using **json-server** as a mock backend. The app allows users to register, log in, and manage shopping lists with full CRUD functionality.

---

## Features

* User registration and login (encrypted passwords)
* Protected routes for authenticated users
* View and update user profile
* Add, edit, and delete shopping lists
* Search and sort shopping lists (URL updates accordingly)
* Categories/tags for list items
* Fully responsive design for all screen sizes

---

## Tech Stack

**Frontend**

* React
* TypeScript
* Redux

**Routing**

* React Router v6

**Backend (Mock API)**

* json-server

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Mluleki23/Task-5-Shopping-List-App-
cd Task-5-Shopping-List-App-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

```bash
npm run dev
```

### 4. Run json-server

```bash
npx json-server --watch db.json --port 4000
```



---

## Folder Structure

```text
src/
 ├─ components/
 ├─ features/
 │   ├─ auth/
 │   └─ shopping/
 ├─ pages/
 │   ├─ Login.tsx
 │   ├─ Register.tsx
 │   ├─ Home.tsx
 │   └─ Profile.tsx
 ├─ app/
 │   └─ store.ts
 └─ index.tsx
```

---

## Example `db.json`

```json
{
  "users": [],
  "lists": []
}
```

---

## Evaluation Checklist

* ✅ Users can register and log in
* ✅ Full CRUD functionality for shopping lists
* ✅ Search and sort synced with URL parameters
* ✅ Protected routes for authenticated users
* ✅ Responsive and user-friendly UI
* ✅ Frequent and meaningful GitHub commits

---

