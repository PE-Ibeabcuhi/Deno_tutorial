import { serve } from "https://deno.land/std@0.62.0/http/server.ts";
import {
  acceptable,
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.2.0/mod.ts";


const tasks = [
  { id: 1, text: "Take out the trash" },
  { id: 2, text: "Buy groceries" },
  { id: 3, text: "Do laundry" },
];

const router = new Router();

router.get("/", async (ctx) => {
  const taskList = tasks
    .map((task) => `<li>${task.text}</li>`)
    .join("");

  ctx.response.body = `
    <html>
      <head>
        <title>To-Do List</title>
      </head>
      <body>
        <h1>To-Do List</h1>
        <form action="/" method="post">
          <input type="text" name="task">
          <input type="submit" value="Add">
        </form>
        <ul>
          ${taskList}
        </ul>
      </body>
    </html>
  `;
});

router.post("/", async (ctx) => {
  try {
    // const body = await ctx.request.body();
    const body = await ctx.request.body({ type: "form" }).value;
    const params = new URLSearchParams(body);
    // const task = body.toString().split('=')[1];
    const task = params.get('task');
    console.log(task);
    tasks.push({ id: tasks.length + 1, text: task as string});
    ctx.response.redirect("/");
  } catch (err) {
    console.log('Error: ', err);
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://localhost:8000");
await app.listen({ port: 8000 });
