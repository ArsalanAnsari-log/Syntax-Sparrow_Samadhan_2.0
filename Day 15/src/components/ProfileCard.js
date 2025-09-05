import React from "react";
import "./ProfileCard.css"; // for styling

const ProfileCard = ({ name, role, avatar, bio }) => {
  return (
    <div className="profile-card">
      <img src={avatar} alt={name} className="profile-avatar" />
      <h2 className="profile-name">{name}</h2>
      <h4 className="profile-role">{role}</h4>
      <p className="profile-bio">{bio}</p>
      <button  className="profile-btn"> <a href="https://adarshkrdubay.in/">Connect</a></button>
    </div>
  );
};

export default ProfileCard;
