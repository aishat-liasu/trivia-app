import os
from unicodedata import category
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10
BASE_URL = '/api/v1.0'

def create_app(test_config=None):
  # create and configure the app
  app = Flask(__name__)
  setup_db(app)
  
  '''
  Set up CORS to Allow '*' for origins
  '''
  CORS(app)

  '''
  after_request decorator to set Access-Control-Allow
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


  def get_category_dict_list():
    categories = Category.query.order_by(Category.id).all()
    categoryList = [category.format() for category in categories]
    categoryDict = {}

    for item in categoryList:
      categoryDict[item["id"]] = item["type"]

    return categoryDict, categoryList

  '''
  Endpoint to handle GET requests 
  for all available categories.
  '''
  @app.route(BASE_URL + "/categories")
  def get_categories():

    categoryDict, categoryList = get_category_dict_list()

    print(categoryList)

    if len(categoryList) == 0:
      abort(404)

    return jsonify(
      {
          "success": True,
          "categories": categoryDict,
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
  Endpoint to handle GET requests for questions, 
  including pagination (every 10 questions). 
  This endpoint returns a list of questions, 
  number of total questions, current category, categories. 
  '''
  @app.route(BASE_URL + "/questions")
  def retrieve_questions():

    selection = Question.query.order_by(Question.id).all()
    current_questions, total_questions = paginate_questions(request, selection)

    if len(current_questions) == 0:
      abort(404)
    
    categoryDict, _ = get_category_dict_list()

    return jsonify(
      {
          "success": True,
          "questions": current_questions,
          "total_questions": total_questions,
          "current_category": "Science",
          "categories": categoryDict
      }
    )

  '''
  Endpoint to DELETE question using a question ID. 
  '''

  @app.route(BASE_URL + "/questions/<int:question_id>", methods=["DELETE"])
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
          "total_questions": total_questions,
        }
      )

    except:
      abort(422)

  '''
  Endpoint to POST a new question, 
  which requires the question and answer text, 
  category, and difficulty score.
  AND ALSO
  Endpoint to get questions based on a search term. 
  It returns any questions for whom the search term 
  is a substring of the question. 
  '''

  @app.route(BASE_URL + "/questions", methods=["POST"])
  def create_question():
    body = request.get_json()

    if body is None or len(body.keys()) < 1:
      abort(400)

    search = body.get("searchTerm", None)

    try:
      if search:
        selection = Question.query.order_by(Question.id).filter(
            Question.question.ilike("%{}%".format(search))
        )
        current_questions, _ = paginate_questions(request, selection)

        return jsonify(
          {
            "success": True,
            "questions": current_questions,
            "total_questions": len(selection.all()),
          }
        )
      else:
        if body["question"] is None or body["answer"] is None or body["category"] is None or body["difficulty"] is None:
          abort(400)

        new_question = body.get("question", None)
        new_answer = body.get("answer", None)
        category = body.get("category", None)
        difficulty = body.get("difficulty", None)
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
  Endpoint to get questions based on category. 
  '''
  @app.route(BASE_URL + "/categories/<int:category_id>/questions")
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
  Endpoint to get questions to play the quiz. 
  This endpoint takes category and previous question parameters 
  and return a random question within the given category, 
  if provided, and that is not one of the previous questions. 
  '''

  def return_questions_per_category(category_id):

    selection = []
    if category_id == 0:
      selection = Question.query.all()
    else:
      selection = Question.query.filter(Question.category == category_id)
    
    current_questions, _ = paginate_questions(request, selection)
    return current_questions


  @app.route(BASE_URL + "/quizzes", methods=["POST"])
  def generate_quiz():
    body = request.get_json()

    prev_questions = body.get("previous_questions", [])
    category = body.get("quiz_category", None)
   
    category_questions = return_questions_per_category(category["id"])
    question_ids = [question["id"] for question in category_questions]
    
    if len(prev_questions) != len(question_ids):
    
      min_limit = min(question_ids)
      max_limit = max(question_ids)
      generated_number = min_limit

      '''
      generates a random number that does not exist in the previously asked questions
      and exists in the categorised questions or general questions
      '''
    
      while generated_number in prev_questions or generated_number not in question_ids:
        generated_number = random.randint(min_limit, max_limit+1)

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
  error handlers for all expected errors 
  - 400, 404, 422 and 522. 
  '''

  @app.errorhandler(400)
  def bad_request(error):
    return jsonify({"success": False, "error": 400, "message": "bad request"}), 400

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

  @app.errorhandler(500)
  def bad_request(error):
    return jsonify({"success": False, "error": 500, "message": "Internal Server Error"}), 500
  
  if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
  
  return app
