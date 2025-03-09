import { useState } from "react";
import { Octokit } from "@octokit/rest";
import {
  TextField,
  Box,
  Button,
  List,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Card,
} from "@mui/material";
import {
  StarBorder,
  ExpandLess,
  ExpandMore,
  Autorenew,
} from "@mui/icons-material";
import { GithubUser, GithubRepository } from "./types";
import "./App.css";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_PAT,
});

function App() {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [repos, setRepos] = useState<Record<string, GithubRepository[]>>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [prevQuery, setPrevQuery] = useState("");
  const [open, setOpen] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleUserClick = (index: number) => {
    setOpen((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  const searchUsers = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const response = await octokit.request("GET /search/users", {
        q: query,
        per_page: 5,
      });

      setUsers(response.data.items);
      setNotFound(response.data.items.length === 0);
      setRepos({});
      setOpen((prev) => prev.map((value) => (value ? false : value)));
      setPrevQuery(query);

      response.data.items.forEach((user) => fetchUserRepos(user.login));
    } catch (error) {
      console.error("Error fetching GitHub users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRepos = async (username: string) => {
    try {
      const response = await octokit.request("GET /users/{username}/repos", {
        username,
      });

      setRepos((prevRepos) => ({
        ...prevRepos,
        [username]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching repos for ${username}:`, error);
    }
  };

  const handleSearchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = query.trim();
    if (!username) return;
    searchUsers();
  };

  return (
    <>
      <Box
        component="form"
        sx={{ minWidth: "320px", display: "flex", flexDirection: "column" }}
        noValidate
        autoComplete="off"
        onSubmit={handleSearchClick}
      >
        <TextField
          id="outlined-basic"
          label="Enter username"
          variant="outlined"
          size="small"
          sx={{ marginBottom: "16px" }}
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={
            loading ? (
              <Autorenew sx={{ animation: "spin 1s linear infinite" }} />
            ) : null
          }
        >
          Search
        </Button>
      </Box>
      {users.length > 0 ? (
        <Typography
          sx={{ textAlign: "left", marginTop: "10px", marginBottom: "10px" }}
        >
          Showing users for "{prevQuery}"
        </Typography>
      ) : null}
      <List
        sx={{
          width: "100%",
          maxWidth: 320,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {users.map((user, index) => (
          <div key={user.id}>
            <ListItemButton
              sx={{
                backgroundColor: "#DCDCDC",
                marginBottom: "8px",
              }}
              onClick={() => handleUserClick(index)}
            >
              <ListItemText primary={user.login} />
              {open[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[index]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {repos[user.login] && repos[user.login].length > 0 ? (
                  repos[user.login].map((repo: GithubRepository) => (
                    <div key={repo.id} className="repo">
                      <ListItemButton>
                        <ListItemText
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontWeight: "bold",
                            },
                          }}
                          primary={repo.name}
                        />
                        <ListItemIcon>
                          <span>{repo.stargazers_count}</span>
                          <StarBorder />
                        </ListItemIcon>
                      </ListItemButton>
                      {repo.description ? (
                        <ListItemButton
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "14px",
                            },
                          }}
                        >
                          <ListItemText primary={repo.description} />
                        </ListItemButton>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <ListItemText primary="No repo" />
                )}
              </List>
            </Collapse>
          </div>
        ))}
        {notFound ? (
          <Card
            variant="outlined"
            sx={{
              backgroundColor: "#DCDCDC",
              marginTop: "16px",
              padding: "2em",
            }}
          >
            No user found
          </Card>
        ) : null}
      </List>
    </>
  );
}

export default App;
