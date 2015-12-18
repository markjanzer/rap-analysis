dope = User.create(username: "dumbledope")
cocoa = Song.create(name: "Cocoa Butter Kisses", album_id: 1, transcriber: dope, spotify_uri: nil)
acid = Album.create(title: "Acid Rap", year: 2013, artist_id: 1)
chance = Artist.create(name: "Chance the Rapper", region: "Midwest")
chance.albums << Album.find(1)
chance.songs << Song.find(1)

glover = Artist.create!(name: "Childish Gambino", region: "South")
bth = Album.create!(title: "Because The Internet", year: 2013, artist_id: 2)
threekfive = Song.create!(name: "3005", album: Album.find(2), transcriber_id: 1, spotify_uri: "3Z2sglqDj1rDRMF5x0Sz2R")
glover.albums << bth
glover.songs << threekfive

