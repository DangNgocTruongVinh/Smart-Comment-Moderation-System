from fastapi import FastAPI, HTTPException

from schemas import CommentRequest, ClassificationResponse
from model import CommentClassifier

app = FastAPI(title="nlp_service - Comment Classifier")


classifier = None
model_init_error = None
try:
    classifier = CommentClassifier()
except Exception as e:
    # Defer the error until the first request so service can start even if model is not yet placed.
    model_init_error = e


@app.post("/classify", response_model=ClassificationResponse)
def classify(request: CommentRequest):
    if model_init_error:
        raise HTTPException(status_code=500, detail=str(model_init_error))

    try:
        label, label_name, confidence = classifier.predict(request.text)
        return ClassificationResponse(label=label, label_name=label_name, confidence=confidence)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001)
