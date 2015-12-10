dope = User.create(username: "dumbledope")
cocoa = Song.create(name: "Cocoa Butter Kisses", album_id: 1)
acid = Album.create(title: "Acid Rap", year: 2013, artist_id: 1)
chance = Artist.create(name: "Chance the Rapper", region: "Midwest")
chance.albums << Album.find(1)
chance.songs << Song.find(1)

