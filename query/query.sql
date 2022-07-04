CREATE TABLE users (id varchar(64) NOT NULL, 
    name varchar(64) NOT NULL,
    email varchar(64) NOT NULL,
    password varchar(64) NOT NULL, 
    phone varchar(64),
    status INT DEFAULT 0,
    photo varchar(255),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    activated_at TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE rooms (room_id varchar(64) NOT NULL, 
    room_name varchar(64) NOT NULL,
    admin varchar(64) NOT NULL,
    room_description varchar(64),
    room_img varchar(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (room_id)
);

CREATE TABLE messages (message_id varchar(64) NOT NULL, 
    id_sender varchar(64) NOT NULL,
    id_receiver varchar(64) NOT NULL,
    message text,
    message_img varchar(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id)
);

CREATE TABLE room_messages (message_id varchar(64) NOT NULL, 
    id_room varchar(64) NOT NULL,
    id_sender varchar(64) NOT NULL,
    message text,
    message_img varchar(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id)
);

CREATE TABLE room_members (room_member_id varchar(64) NOT NULL, 
    id_room varchar(64) NOT NULL,
    id_user varchar(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_member_id)
);

CREATE TABLE contact (contact_id varchar(64) NOT NULL, 
    id_user varchar(64) NOT NULL,
    id_friend varchar(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contact_id)
);

