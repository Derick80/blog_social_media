export default function NewPostRoute() {
  return (
    <div className="w-full col-span-1 md:row-start-2 md:row-span-1 md:col-start-4 md:col-end-10 flex mx-auto max-w">
      <div className="w-full flex flex-col items-center">
        <div className="text-5xl font-extrabold">Write a New Post</div>

        <form method="post" className="text-xl w-1/2 font-semibold">
          <div>
            <label>
              Title:{" "}
              <input
                type="text"
                name="title"
                className="dark:text-black w-full p-2 rounded-xl my-2"
              />
            </label>
          </div>
          <div>
            <label>
              Body:{" "}
              <textarea
                name="body"
                className="dark:text-black w-full p-2 rounded-xl my-2"
              />
            </label>
          </div>
          <div>
            <button type="submit" className="button">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
