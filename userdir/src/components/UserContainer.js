import React from "react";
import "./styles.css";
import API from "../utils/API";

class UserContainer extends React.Component {
  //set initial state
  state = {
    users: [],
    search: "",
    sortDirection: "",
    col: ""
  };

  //after the component mounts, send a get request to retrieve the users.
  //Map over the response to create an array of user objects.
  //Use setState to add the array to our users state.
  componentDidMount() {
    API.UsersList()
      .then(res => {
        const userArray = res.data.map(user => {
          return {
            id: user.id,
            name: user.FullName,
            country: user.Country,
            email: user.Email,
            dob: user.DateOfBirth
          };
        });
        this.setState({ users: userArray });
      })
      .catch(err => console.log(err));
  }

  //function to update search state each time the user types a character
  handleSearchChange = e => {
    this.setState({ search: e.target.value });
  };

  //function to filter list to only show first/last that matches search
  filteredUsers() {
    const search = this.state.search.toLowerCase();
    return this.state.users.filter(user => {
      return (
        user.name.toLowerCase().includes(search)
      );
    });
  }

  delete = (id) => {
    fetch('http://localhost:5000/users/'+id, {
      method:"DELETE",
    }).then((result) => {
      result.json().then((resp) => {
        console.log("data deleted")
      })
    })
  }


  //function to render a table of users
  renderUsers = () => {
    return this.filteredUsers()
      .sort(this.sortUsers)
      .map((user, index) => {
        return (
          <tr key={index}>
            <td>{user.name}</td>
            <td>{user.country}</td>
            <td>{user.email}</td>
            <td>{new Date(user.dob).toDateString()}</td>
            <button>Edit</button>
            <button onClick = {() => this.delete(user.id)}>Delete</button>
          </tr>
        );
      });
  };



  //function to return 1 or -1 to sort function depending on sort direction
  sortUsers = (a, b) => {
    if (a[this.state.col] < b[this.state.col]) {
      return this.state.sortDirection === "ascending" ? -1 : 1;
    } else if (a[this.state.col] > b[this.state.col]) {
      return this.state.sortDirection === "ascending" ? 1 : -1;
    }
    return 0;
  };

  //render the user container including search field
  render() {
    return (
      <>
        <div className="input-group justify-content-center">
          <div className="input-group-prepend"></div>
          <input
            onChange={this.handleSearchChange}
            type="search"
            className="form-control m-3"
            placeholder="Search"
            aria-label="SearchBox"
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="table m-3">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">
                  <span>
                    Name
                  </span>
                </th>
                <th scope="col">
                  <span>
                    Country
                  </span>
                </th>
                <th scope="col">
                  <span>
                    Email
                  </span>
                </th>
                <th scope="col">
                  <span>
                    Date Of Birth
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderUsers()}</tbody>
          </table>
        </div>
      </>
    );
  }
}

export default UserContainer;