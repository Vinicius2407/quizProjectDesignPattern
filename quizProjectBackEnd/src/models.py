import json

class Question:
    def __init__(self, id, question, options, correctAnswer):
        self.id = id
        self.question = question
        self.options = options
        self.correctAnswer = correctAnswer


def loadQuestions(filename):
    with open(filename, "r") as file:
        data = json.load(file)
        qustionsData = data
        questions = [
            Question(q['id'], q['question'], q['options'], q['correctAnswer']) for q in qustionsData
        ]
        return questions