import os
from unicodedata import category
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10

def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__)
  setup_db(app)
  
  '''
  @TODO: Set up CORS. Allow '*' for origins. Delete the sample route after completing the TODOs
  '''
  CORS(app)

  '''
  @TODO: Use the after_request decorator to set Access-Control-Allow
  '''
  # CORS Headers
  @app.after_request
  def after_request(response):
      response.headers.add(
          "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
      )
      response.headers.add(
          "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
      )
      return response

  '''
  @TODO: 
  Create an endpoint to handle GET requests 
  for all available categories.
  '''
  @app.route("/categories")
  def get_categories():
    categories = Category.query.order_by(Category.id).all()
    categoryList = [category.format() for category in categories]
    categoryObj = {}

    for item in categoryList:
      categoryObj[item["id"]] = item["type"]

    if len(categories) == 0:
      abort(404)

    return jsonify(
      {
          "success": True,
          "categories": categoryObj,
      }
    )

  
  def paginate_questions(request, selection):
    page = request.args.get("page", 1, type=int)
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE

    questions = [question.format() for question in selection]
    current_questions = questions[start:end]
    total_questions = len(Question.query.all())

    return [current_questions, total_questions]


  '''
  @TODO: 
  Create an endpoint to handle GET requests for questions, 
  including pagination (every 10 questions). 
  This endpoint should return a list of questions, 
  number of total questions, current category, categories. 

  TEST: At this point, when you start the application
  you should see questions and categories generated,
  ten questions per page and pagination at the bottom of the screen for three pages.
  Clicking on the page numbers should update the questions. 
  '''
  @app.route("/questions")
  def retrieve_questions():

    selection = Question.query.order_by(Question.id).all()
    current_questions, total_questions = paginate_questions(request, selection)

    if len(current_questions) == 0:
        abort(404)

    
    categories = Category.query.order_by(Category.id).all()
    categoryList = [category.format() for category in categories]
    categoryObj = {}

    for item in categoryList:
      categoryObj[item["id"]] = item["type"]

    return jsonify(
        {
            "success": True,
            "questions": current_questions,
            "total_questions": total_questions,
            "categories": categoryObj
        }
    )

  '''
  @TODO: 
  Create an endpoint to DELETE question using a question ID. 

  TEST: When you click the trash icon next to a question, the question will be removed.
  This removal will persist in the database and when you refresh the page. 
  '''

  @app.route("/questions/<int:question_id>", methods=["DELETE"])
  def delete_question(question_id):
    try:
      question = Question.query.filter(Question.id == question_id).one_or_none()

      if question is None:
          abort(404)

      question.delete()
      selection = Question.query.order_by(Question.id).all()
      current_questions, total_questions = paginate_questions(request, selection)

      return jsonify(
          {
              "success": True,
              "deleted": question_id,
              "questions": current_questions,
              "total_questions": total_questions,
          }
      )

    except:
        abort(422)

  '''
  @TODO: 
  Create an endpoint to POST a new question, 
  which will require the question and answer text, 
  category, and difficulty score.

  TEST: When you submit a question on the "Add" tab, 
  the form will clear and the question will appear at the end of the last page
  of the questions list in the "List" tab.  
  '''

  '''
  @TODO: 
  Create a POST endpoint to get questions based on a search term. 
  It should return any questions for whom the search term 
  is a substring of the question. 

  TEST: Search by any phrase. The questions list will update to include 
  only question that include that string within their question. 
  Try using the word "title" to start. 
  '''

  @app.route("/questions", methods=["POST"])
  def create_question():
    body = request.get_json()

    new_question = body.get("question", None)
    new_answer = body.get("answer", None)
    category = body.get("category", None)
    difficulty = body.get("difficulty", None)
    search = body.get("searchTerm", None)

    try:
      if search:
        selection = Question.query.order_by(Question.id).filter(
            Question.question.ilike("%{}%".format(search))
        )
        #selection = Question.query.order_by(Question.id).filter(or_(Question.question.ilike('%{}%'.format(search)), Question.answer.ilike('%{}%'.format(search))))
        current_questions, _ = paginate_questions(request, selection)

        return jsonify(
            {
                "success": True,
                "questions": current_questions,
                "total_questions": len(selection.all()),
            }
        )
      else:
        question = Question(question=new_question, answer=new_answer,category=category, difficulty=difficulty)
        question.insert()

        selection = Question.query.order_by(Question.id).all()
        current_questions, total_questions = paginate_questions(request, selection)

        return jsonify(
            {
                "success": True,
                "created": question.id,
                "questions": current_questions,
                "total_questions": total_questions,
            }
        )

    except:
        abort(422)

  '''
  @TODO: 
  Create a GET endpoint to get questions based on category. 

  TEST: In the "List" tab / main screen, clicking on one of the 
  categories in the left column will cause only questions of that 
  category to be shown. 
  '''
  @app.route("/categories/<int:category_id>/questions")
  def get_questions_by_category(category_id):
    selection = Question.query.filter(Question.category == category_id)
    current_questions, _ = paginate_questions(request, selection)

    if len(current_questions) == 0:
      abort(404)

    return jsonify(
        {
            "success": True,
            "questions": current_questions,
            "current_category": category_id,
            "total_questions": len(selection.all()),
        }
      )

  '''
  @TODO: 
  Create a POST endpoint to get questions to play the quiz. 
  This endpoint should take category and previous question parameters 
  and return a random questions within the given category, 
  if provided, and that is not one of the previous questions. 

  TEST: In the "Play" tab, after a user selects "All" or a category,
  one question at a time is displayed, the user is allowed to answer
  and shown whether they were correct or not. 
  '''

  def return_questions(category_id):
    if category_id == 0:
      selection = Question.query.all()
      current_questions, _ = paginate_questions(request, selection)
      return current_questions
    else:
      selection = Question.query.filter(Question.category == category_id)
      current_questions, _ = paginate_questions(request, selection)
      return current_questions


  @app.route("/quizzes", methods=["POST"])
  def generate_quiz():
    body = request.get_json()

    prev_questions = body.get("previous_questions", [])
    category = body.get("quiz_category", None)
   
    category_questions = return_questions(category["id"])
    question_ids = [question["id"] for question in category_questions]
    
    print(question_ids)

    if len(prev_questions) != len(question_ids):
    
      min_limit = min(question_ids)
      max_limit = max(question_ids)
      generated_number = min_limit
    
      while generated_number in prev_questions or generated_number not in question_ids:
        generated_number = random.randint(min_limit, max_limit+1)
        print(generated_number)

      print(generated_number)

      next_question = Question.query.filter(Question.id == generated_number).one_or_none()
      formatted_next_question = next_question.format()

      return jsonify(
          {
              "success": True,
              "question": formatted_next_question,
          }
      )

    else:
      return jsonify(
          {
              "success": True,
              "question": "",
          }
      ) 


  '''
  @TODO: 
  Create error handlers for all expected errors 
  including 404 and 422. 
  '''
  @app.errorhandler(404)
  def not_found(error):
    return (
        jsonify({"success": False, "error": 404, "message": "resource not found"}),
        404,
    )

  @app.errorhandler(422)
  def unprocessable(error):
    return (
        jsonify({"success": False, "error": 422, "message": "unprocessable"}),
        422,
    )

  @app.errorhandler(400)
  def bad_request(error):
    return jsonify({"success": False, "error": 400, "message": "bad request"}), 400
  
  return app

    