# Supabase React Task Manager

A simple CRUD Task Manager built with **React** and **Supabase**.  
Users can sign up, sign in, add, edit, and delete tasks. Tasks can include images (if your Supabase table supports it). Real-time updates are supported via Supabase Channels.

---

## Features

- User authentication (sign up & sign in)
- Add, edit, and delete tasks
- Optional image upload for tasks
- Real-time updates when new tasks are added
- Responsive and modern UI

---

## Technologies Used

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/supabase-react-taskmanager.git
cd supabase-react-taskmanager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

- Create a [Supabase](https://supabase.com/) project.
- Create a `tasks` table with at least these columns:

  - `id` (integer, primary key, auto-increment)
  - `title` (text)
  - `description` (text)
  - `created_at` (timestamp, default: now())
  - `image_url` (text, optional, if you want image uploads)

- (Optional) Set up [Supabase Storage](https://supabase.com/docs/guides/storage) for image uploads.

### 4. Configure environment variables

Create a `.env` file in the root of your project and add:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these in your Supabase project settings.

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the app.

---

## Project Structure

```
src/
  components/
    AuthForm.tsx      # Handles user sign in/sign up
    TaskManager.tsx   # Main CRUD logic for tasks
  supabase-client.ts  # Supabase client setup
  App.tsx             # Main app logic
  App.css             # Styles
```

---

## Customization

- To associate tasks with users, add a `user_id` or `email` column to your `tasks` table and update the insert logic.
- To support images, ensure your table has an `image_url` column and Supabase Storage is enabled.

---

## License

MIT

---

## Credits

Built with [Supabase](https://supabase.com/) and [React](https://react.dev/).
