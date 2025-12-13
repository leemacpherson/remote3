import { Form, useFetcher } from "react-router";
import type { Route } from "./+types/contact";

import { getContact, updateContact, type ContactRecord } from "../data";

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log("formdata for favorite ", formData);
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not found", { status: 404 });
  }
  return { contact };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div id="contact">
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.last} - {contact.first}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        <div>
          <span>
            <img
              alt={`${contact.first} ${contact.last} avatar`}
              key={contact.avatar}
              src={contact.avatar}
            />
            <div>{contact.notes ? <p>{contact.notes}</p> : null}</div>
          </span>
        </div>

        <div>
          {/* <Form action="edit">
            <button type="submit">Edit</button>
          </Form> */}

          {/* <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form> */}
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;
  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
