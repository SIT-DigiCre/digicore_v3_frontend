from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True
)

# URLとメソッドの指定
@app.route("/auth/checkauth", methods=["GET"])
def CheckAuth():
  return {"result": True}

@app.route("/auth/user", methods=["GET"])
async def GetUser():
  return {
    "id": "hogehoge",
    "username": "最上土川",
    "studentNumber": "ae19051",
    "schoolGrade": 2,
    "iconUrl": "https://pbs.twimg.com/profile_images/1308658397382733824/BSTK8cGS_400x400.jpg",
    "discordUserId": "hogeghoge",
    "activeLimit": "2023-01-01",
    "firstName": "敦也",
    "lastName": "土川"
  }

if __name__ == "__main__":
    app.run(debug=True, port=8000)