CREATE TABLE channels(
	id bigint(20) NOT NULL,
	name varchar(255),
	description varchar(2000),
	email varchar(255),
	bannerImage varchar(255),
	channelImage varchar(255),
	PRIMARY KEY (id)
);

CREATE TABLE channel_subscribers (
    user_id BIGINT NOT NULL,
    subscribed_at datetime(6),
    channel_id BIGINT NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
);