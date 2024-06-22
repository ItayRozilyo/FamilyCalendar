import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../css/PermissionsModal.css"; // Import CSS file for styling

const ITEM_TYPE = "USER";

const PermissionsModal = ({ isOpen, onClose, onPermissionsUpdated, users }) => {
  const [editors, setEditors] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [noPermissions, setNoPermissions] = useState([]);

  useEffect(() => {
    setEditors(users.editors);
    setViewers(users.viewers);
    setNoPermissions(users.noPermissions);
  }, [users]);

  const moveUser = (user, fromList, toList) => {
    if (fromList === "editors") {
      setEditors(editors.filter(editor => editor.id !== user.id));
    } else if (fromList === "viewers") {
      setViewers(viewers.filter(viewer => viewer.id !== user.id));
    } else if (fromList === "noPermissions") {
      setNoPermissions(noPermissions.filter(noPermUser => noPermUser.id !== user.id));
    }

    if (toList === "editors") {
      setEditors([...editors, user]);
    } else if (toList === "viewers") {
      setViewers([...viewers, user]);
    } else if (toList === "noPermissions") {
      setNoPermissions([...noPermissions, user]);
    }
  };

  const handleSubmit = () => {
    onPermissionsUpdated({
      editors: editors.map(user => user.id),
      viewers: viewers.map(user => user.id)
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="permissions-modal">
      <DndProvider backend={HTML5Backend}>
        <div className="permissions-container">
          <UserList
            title="No permissions"
            users={noPermissions}
            moveUser={moveUser}
            fromList="noPermissions"
          />
          <UserList
            title="Viewers"
            users={viewers}
            moveUser={moveUser}
            fromList="viewers"
          />
          <UserList
            title="Editors"
            users={editors}
            moveUser={moveUser}
            fromList="editors"
          />
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Update Permissions
        </button>
      </DndProvider>
    </Modal>
  );
};

PermissionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPermissionsUpdated: PropTypes.func.isRequired,
  users: PropTypes.shape({
    editors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })),
    viewers: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })),
    noPermissions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

const UserList = ({ title, users, moveUser, fromList }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => {
      moveUser(item.user, item.fromList, fromList);
    }
  });

  return (
    <div className="user-list" ref={drop}>
      <h3>{title}</h3>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredUsers.map((user) => (
        <DraggableUser key={user.id} user={user} fromList={fromList} />
      ))}
    </div>
  );
};

const DraggableUser = ({ user, fromList }) => {
  const [, drag] = useDrag({
    type: ITEM_TYPE,
    item: { user, fromList }
  });

  return (
    <div ref={drag} className="draggable-user">
      {user.name}
    </div>
  );
};

export default PermissionsModal;
