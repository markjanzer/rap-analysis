# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160405034630) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "album_artists", force: :cascade do |t|
    t.integer  "album_id"
    t.integer  "artist_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "albums", force: :cascade do |t|
    t.string   "title"
    t.integer  "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "artist_sections", force: :cascade do |t|
    t.integer  "artist_id"
    t.integer  "section_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "artist_songs", force: :cascade do |t|
    t.integer  "artist_id"
    t.integer  "song_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "artists", force: :cascade do |t|
    t.string   "name"
    t.string   "region"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cells", force: :cascade do |t|
    t.integer  "measure_id"
    t.integer  "measure_cell_number"
    t.integer  "note_beginning"
    t.integer  "note_duration"
    t.boolean  "stressed",            default: false
    t.boolean  "end_rhyme",           default: false
    t.string   "rhyme"
    t.string   "content"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  create_table "measures", force: :cascade do |t|
    t.integer  "phrase_id"
    t.integer  "section_measure_number"
    t.integer  "phrase_measure_number"
    t.float    "total_rhythmic_value"
    t.boolean  "rhythmic_errors",        default: false
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  create_table "phrases", force: :cascade do |t|
    t.integer  "section_id"
    t.integer  "section_phrase_number"
    t.integer  "number_of_measures"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "sections", force: :cascade do |t|
    t.string   "section_type"
    t.integer  "section_number"
    t.integer  "song_id"
    t.integer  "default_subdivision"
    t.integer  "number_of_pickup_measures"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "songs", force: :cascade do |t|
    t.string   "name"
    t.string   "region"
    t.integer  "album_id"
    t.integer  "transcriber_id"
    t.boolean  "published",      default: false
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "password_hash"
    t.boolean  "super",         default: false
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

end
