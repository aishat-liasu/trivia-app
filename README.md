# Full Stack Trivia App

Udacity is invested in creating bonding experiences for its employees and students. A bunch of team members got the idea to hold trivia on a regular basis and created a web app to manage the trivia app and play the game.

The web application:

1. Displays questions - both all questions and questions by category. All questions show the question, category and difficulty rating by default and can show/hide the answer.
2. Allows deleting of questions.
3. As well as the capacity to add new questions provided that they include question and answer text.
4. Allows searching of questions based on a text query string.
5. Enables users play the quiz game, randomizing either all questions or within a specific category.

## About the Stack

- Backend: Python, Flask
- Frontend: React (Class-based Components), jQuery

### Pre-requisites and Local Development 
Developers using this project should already have Python3 (Preferably 3.7 or 3.8), pip and node installed on their local machines.

#### Backend

All the required dependenices are included in the requirements file to run the backend service. It is highly recommended to use a virtual environment whenever using Python for projects. 

Assuming you are in the root folder, to run the application run the following commands: 

```
cd backend
python -m venv venv
source venv/Scripts/activate
pip install requirements.txt
export FLASK_APP=flaskr
export FLASK_ENV=development
python -m flask run (What worked for me)
```

These commands install and activate the virtual environment, install required packages, put the application in development and directs our application to use the `__init__.py` file in our flaskr folder. 
Working in development mode shows an interactive debugger in the console and restarts the server whenever changes are made. If running locally on Windows, look for the commands in the [Flask documentation](http://flask.pocoo.org/docs/1.0/tutorial/factory/).

The application is run on `http://127.0.0.1:5000/` by default and is a proxy in the frontend configuration. 

#### Frontend

The frontend React consumes data from the Flask server. 
From the frontend folder, run the following commands to start the client: 

```
npm install // only once to install dependencies
npm start 
```

By default, the frontend will run on localhost:3000. 

### Tests
In order to run tests navigate to the backend folder and run the following commands: 

```
dropdb -U postgres trivia_test
createdb -U postgres trivia_test_db
psql -U postgres -d trivia_test_db -f trivia.psql
python test_flaskr.py
```

The first time you run the tests, omit the dropdb command. 

All tests are kept in that file and should be maintained as updates are made to app functionality. 

## API Reference

### Getting Started
- Base URL: At present this app can only be run locally and is not hosted as a base URL. The backend app is hosted at the default, `http://127.0.0.1:5000/`, which is set as a proxy in the frontend configuration. 
- Authentication: This version of the application does not require authentication or API keys. 

### Error Handling
Errors are returned as JSON objects in the following format:
```
{
    "success": False, 
    "error": 400,
    "message": "bad request"
}
```
The API will return three error types when requests fail:
- 400: Bad Request
- 404: Resource Not Found
- 422: Not Processable 
- 500: Internal Server Error

### Endpoints 

#### GET `/api/v1.0/categories`
- Fetches a dictionary of categories in which the keys are the ids and the value is the corresponding string of the category
- Request Arguments: None
- Returns: An object with a single key, categories, that contains a object of id: category_string key:value pairs. 
- Sample: `curl http://127.0.0.1:5000/api/v1.0/categories`

```
    {
    "categories": {
        "1": "Science",
        "2": "Art",
        "3": "Geography",
        "4": "History",
        "5": "Entertainment",
        "6": "Sports"
    },
    "success": true
}
```

#### GET `/api/v1.0/questions`
- Returns a list of question objects, success value, a dictionary of categories, current category and total number of questions
- Results are paginated in groups of 10. Include a request argument to choose page number, starting from 1. 
- Sample: `curl http://127.0.0.1:5000/api/v1.0/questions`

``` 
{
    "categories": {
        "1": "Science",
        "2": "Art",
        "3": "Geography",
        "4": "History",
        "5": "Entertainment",
        "6": "Sports"
    },
    "current_category": "Science",
    "questions": [
        {
            "answer": "Apollo 13",
            "category": 5,
            "difficulty": 4,
            "id": 2,
            "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
        },
        {
            "answer": "Tom Cruise",
            "category": 5,
            "difficulty": 4,
            "id": 4,
            "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
        },
        {
            "answer": "Maya Angelou",
            "category": 4,
            "difficulty": 2,
            "id": 5,
            "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
        },
        {
            "answer": "Edward Scissorhands",
            "category": 5,
            "difficulty": 3,
            "id": 6,
            "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
        },
        {
            "answer": "Muhammad Ali",
            "category": 4,
            "difficulty": 1,
            "id": 9,
            "question": "What boxer's original name is Cassius Clay?"
        },
        {
            "answer": "Brazil",
            "category": 6,
            "difficulty": 3,
            "id": 10,
            "question": "Which is the only team to play in every soccer World Cup tournament?"
        },
        {
            "answer": "Uruguay",
            "category": 6,
            "difficulty": 4,
            "id": 11,
            "question": "Which country won the first ever soccer World Cup in 1930?"
        },
        {
            "answer": "George Washington Carver",
            "category": 4,
            "difficulty": 2,
            "id": 12,
            "question": "Who invented Peanut Butter?"
        },
        {
            "answer": "Lake Victoria",
            "category": 3,
            "difficulty": 2,
            "id": 13,
            "question": "What is the largest lake in Africa?"
        },
        {
            "answer": "The Palace of Versailles",
            "category": 3,
            "difficulty": 3,
            "id": 14,
            "question": "In which royal palace would you find the Hall of Mirrors?"
        }
    ],
    "success": true,
    "total_questions": 20
}
```

#### POST `/api/v1.0/questions`
- Creates a new question using the submitted question, answer, category and difficulty. 
- Returns the id of the created question, success value, total questions, and question list based on current page number to update the frontend. 
- Sample: `curl http://127.0.0.1:5000/api/v1.0/questions -X POST -H "Content-Type: application/json" -d '{"answer": "3", "category": 1, "difficulty": 2, "question": "What is the recommended number of times to brush one's teeth in a day?"}'`

```
{
    "created": 31,
    "questions": [
        {
            "answer": "Apollo 13",
            "category": 5,
            "difficulty": 4,
            "id": 2,
            "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
        },
        {
            "answer": "Tom Cruise",
            "category": 5,
            "difficulty": 4,
            "id": 4,
            "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
        },
        {
            "answer": "Maya Angelou",
            "category": 4,
            "difficulty": 2,
            "id": 5,
            "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
        },
        {
            "answer": "Edward Scissorhands",
            "category": 5,
            "difficulty": 3,
            "id": 6,
            "question": "What was the title of the 1990 fantasy directed by Tim Burton about a young man with multi-bladed appendages?"
        },
        {
            "answer": "Muhammad Ali",
            "category": 4,
            "difficulty": 1,
            "id": 9,
            "question": "What boxer's original name is Cassius Clay?"
        },
        {
            "answer": "Brazil",
            "category": 6,
            "difficulty": 3,
            "id": 10,
            "question": "Which is the only team to play in every soccer World Cup tournament?"
        },
        {
            "answer": "Uruguay",
            "category": 6,
            "difficulty": 4,
            "id": 11,
            "question": "Which country won the first ever soccer World Cup in 1930?"
        },
        {
            "answer": "George Washington Carver",
            "category": 4,
            "difficulty": 2,
            "id": 12,
            "question": "Who invented Peanut Butter?"
        },
        {
            "answer": "Lake Victoria",
            "category": 3,
            "difficulty": 2,
            "id": 13,
            "question": "What is the largest lake in Africa?"
        },
        {
            "answer": "The Palace of Versailles",
            "category": 3,
            "difficulty": 3,
            "id": 14,
            "question": "In which royal palace would you find the Hall of Mirrors?"
        }
    ],
    "success": true,
    "total_questions": 21
}
```

#### POST `/api/v1.0/questions`
- Search for questions using the submitted searchTerm. 
- Returns success value, total questions that has the searchTerm text and the list of question based on current page number to update the frontend. 
- Sample: `curl http://127.0.0.1:5000/api/v1.0/questions -X POST -H "Content-Type: application/json" -d '{"searchTerm": "body"}'`

```
{
    "questions": [
        {
            "answer": "The Liver",
            "category": 1,
            "difficulty": 4,
            "id": 20,
            "question": "What is the heaviest organ in the human body?"
        }
    ],
    "success": true,
    "total_questions": 1
}

```

#### DELETE `/api/v1.0/questions/{question_id}`
- Deletes the question of the given ID if it exists. 
- Returns the id of the deleted question, success value and total questions. 
- Sample: `curl -X DELETE http://127.0.0.1:5000/api/v1.0/questions/31?page=2`

```
{
    "deleted": 31,
    "success": true,
    "total_questions": 20
}
```

#### GET `/api/v1.0/categories/{category_id}/questions`
- Returns a list of question objects under the specified category, success value, a dictionary of categories, current category and total number of questions
- Results are paginated in groups of 10. Include a request argument to choose page number, starting from 1. 
- Sample: `curl http://127.0.0.1:5000/api/v1.0/categories/2/questions`

```
{
    "current_category": 2,
    "questions": [
        {
            "answer": "Escher",
            "category": 2,
            "difficulty": 1,
            "id": 16,
            "question": "Which Dutch graphic artist–initials M C was a creator of optical illusions?"
        },
        {
            "answer": "Mona Lisa",
            "category": 2,
            "difficulty": 3,
            "id": 17,
            "question": "La Giaconda is better known as what?"
        },
        {
            "answer": "One",
            "category": 2,
            "difficulty": 4,
            "id": 18,
            "question": "How many paintings did Van Gogh sell in his lifetime?"
        },
        {
            "answer": "Jackson Pollock",
            "category": 2,
            "difficulty": 2,
            "id": 19,
            "question": "Which American artist was a pioneer of Abstract Expressionism, and a leading exponent of action painting?"
        }
    ],
    "success": true,
    "total_questions": 4
}
```

#### POST `/api/v1.0/quizzes`
- Generates a new question based on category specified and also a question that hasn't been previously asked based on the ids of the previous questions list
- Returns success value, and the new question to ask the player 
- Sample: `curl http://127.0.0.1:5000/api/v1.0/questions -X POST -H "Content-Type: application/json" -d '{"previous_questions": [18, 19], "quiz_category": { "type": "Art", "id": "2"} }'`

```
{
    "success": True,
    "question": {
        "answer": "Escher",
        "category": 2,
        "difficulty": 1,
        "id": 16,
        "question": "Which Dutch graphic artist–initials M C was a creator of optical illusions?"
    }
}
```

## Deployment 
N/A

## Authors
Aishat

## Acknowledgements 
Udacity 


