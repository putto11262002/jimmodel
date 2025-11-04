## Models Table

id: uuid() - primary key, default: gen_random_uuid()
name: varchar(255) - not null
nickName: varchar(100) | null
gender: pgEnum('gender', ['male', 'female', 'non-binary']) - not null
dateOfBirth: date() | null
nationality: varchar(100) | null
ethnicity: varchar(100) | null
talents: text().array() | null
bio: text() | null
experience: text().array() | null

local: boolean() - not null, default: false
inTown: boolean() - not null, default: false

published: boolean() - not null, default: false

height: numeric(5, 2) | null  (in cm)
weight: numeric(5, 2) | null  (in kg)
hips: numeric(5, 2) | null  (in cm)
hairColor: pgEnum('hair_color', ['black', 'brown', 'blonde', 'red', 'grey', 'white', 'other']) | null
eyeColor: pgEnum('eye_color', ['brown', 'blue', 'green', 'hazel', 'grey', 'amber', 'other']) | null

profileImageURL: text() | null

category: pgEnum('category', ['male', 'female', 'non-binary', 'kids', 'seniors']) - not null
  - infer rule:
     if age < 18 then "kids"
     else if age >= 60 then "seniors"
     else gender

createdAt: timestamp() - not null, default: now()
updatedAt: timestamp() - not null, default: now()




## Model Images Table

id: uuid() - primary key, default: gen_random_uuid()
modelId: uuid() - not null, references models(id), onDelete: cascade
url: text() - not null
type: pgEnum('image_type', ['book', 'polaroid', 'composite']) | null
order: integer() - not null, default: 0
createdAt: timestamp() - not null, default: now()


Bussiness rules:
- Create model taking in createModelInput
- Update model taking in updateModelInput
- uploadModelProfileImage take in formData with image file
- removeModelImage taking in modelImageId
- uploadModelImage taking in modelId and formData with image file and type

