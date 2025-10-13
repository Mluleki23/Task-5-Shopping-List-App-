<img src="https://socialify.git.ci/Mluleki23/Task-5-Shopping-List-App-/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Task-5-Shopping-List-App-" width="640" height="320" />
# Shopping List App



---

## Overview

A simple and responsive Shopping List web app built with **React + TypeScript + Redux** using **json-server** for data storage. It allows users to register, log in, and manage shopping lists with full CRUD operations.

---

## Features

* User registration & login (encrypted passwords)
* Protected routes for logged-in users
* Profile view & update
* Add, edit, delete shopping lists
* Search and sort lists (URL updates accordingly)
* Categories/tags for items
* Responsive layout for all screen sizes

---

## Tech Stack

* **Frontend:** React, TypeScript, Redux
* **Routing:** React Router v6

---

## Setup

```bash
# Clone repo
git clone https://github.com/<your-username>/<repo-name>.git
cd repo-name

# Install dependencies
npm install

# Run json-server
npx json-server --watch db.json --port 4000

# Start app
npm start
```

---

## Folder Structure

```
src/
 ├─ components/
 ├─ features/ (auth, shopping)
 ├─ pages/ (Login, Register, Home, Profile)
 ├─ app/store.ts
 └─ index.tsx
```

---

## Example db.json

```json
{
  "users": [],
  "lists": []
}
```

---

## Evaluation Checklist

✅ Users can register/login
✅ CRUD shopping lists
✅ Search & sort synced to URL
✅ Protected routes
✅ Responsive & user-friendly UI
✅ Frequent GitHub commits

---

## License

MIT — Academic submission for coursework.
