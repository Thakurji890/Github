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
      const res = await fetch(`http://localhost:5500/repo/user/${userId}`);

      const data = await res.json();
      console.log(data);
    };
  }, []);

  return;
};

export default Dashoard;
