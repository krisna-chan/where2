import ListingComponent from "./reusable/ListingComponent";
import config from "./../config";
import React, { useEffect, useState } from 'react';

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    try {
      const response = await fetch(config.analytics.getAllUsers);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ListingComponent
      title="USER LISTING"
      data={users.data}
      columns={["ID", "Email", "Role"]}
      totalItems={users.data.length}
      additionalStats={[
        { label: "Total Admins", value: users.data.filter(user => user.role === "admin").length }
      ]}
    />
  );
};

export default UserListing;
