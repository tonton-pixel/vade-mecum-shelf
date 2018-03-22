let myNotification = new Notification
(
    "Vade Mecum Shelf",
    { body: "Lorem ipsum dolor sit amet..." }
);
myNotification.onclick = () => { $.clear (); $.writeln ("Notification clicked."); };
