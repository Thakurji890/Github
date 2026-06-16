import React, { useEffect, useId, useState } from "react";
import axios from "axios";

const Dashoard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchRepositories = async () => {
      try {
        const res = await fetch(`http://localhost:5500/repo/user/${userId}`);

        const data = await res.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error(`${err} while fetching Repositories`);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await fetch(`http://localhost:5500/repo/all`);
        const data = res.json();
        setSuggestedRepositories(data);
      } catch (error) {
        console.error(`${error} while fectching Repositories `);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResult(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResult(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <section>
      <aside>
        <h3>Suggested Repositories</h3>
        {suggestedRepositories.map((repo) => {
          return (
            <div key={repo._id}>
              <h4>{repo.name}</h4>
              <p>{repo.description}</p>
            </div>
          );
        })}
      </aside>
      <main></main>
      <aside>
        <h3>Upcoming Events</h3>
        <ul>
          <li>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              optio dolorum totam neque quaerat sint mollitia laboriosam quae
              aperiam consectetur nesciunt enim eaque minima nostrum labore ut,
              sed, vel atque.
            </p>
          </li>
          <li>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Doloribus, accusantium esse et commodi sed sint quas explicabo
              modi necessitatibus harum. Vitae veritatis ratione est corrupti
              sequi excepturi soluta voluptatum deserunt.
            </p>
          </li>
        </ul>
      </aside>
    </section>
  );
};

export default Dashoard;
