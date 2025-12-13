import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigation,
  useSubmit,
} from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    console.log("searchField holds ", searchField);
  }, [q]);

  return (
    <>
      <div id="sidebar">
        {/* <h1>
          <Link to="about">React Router Contacts</Link>
        </h1> */}
        <div>
          <Form
            id="search-form"
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
            role="search"
          >
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              defaultValue={q || ""}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          {/* <Form method="post">
            <button type="submit">New</button>
          </Form> */}
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li style={{ display: "grid" }} key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        <div style={{ gridColumn: "1", gridRow: "1" }}>
                          {contact.first} <br></br>
                          {contact.last} <br></br>
                          <img
                            alt={`${contact.first} ${contact.last} avatar`}
                            key={contact.avatar}
                            src={contact.avatar}
                          />
                        </div>
                        {/* <div style={{ gridColumn: "1", gridRow: "1" }}>
                          {contact.last}
                        </div> */}
                        {/* <div style={{ gridColumn: "1", gridRow: "1" }}>
                          <img
                            alt={`${contact.first} ${contact.last} avatar`}
                            key={contact.avatar}
                            src={contact.avatar}
                          />
                        </div> */}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
        id="detail"
      >
        <Outlet />
      </div>
    </>
  );
}
