import React, { useContext } from "react";

 //once backend is setup, create onSubmit function for this form
const form = 
<form>
  <div>
    <label>Name:</label>
    <input
      type="text"
      name="name"
      required
    />
  </div>
  <div>
    <label>Stars:</label>
    <select>
      <option>&#9733;&#9733;&#9733;&#9733;&#9733;</option>
      <option>&#9733;&#9733;&#9733;&#9733;</option>
      <option>&#9733;&#9733;&#9733;</option>
      <option>&#9733;&#9733;</option>
      <option>&#9733;</option>
    </select>
  </div>
  <div>
    <label>Review:</label>
    <input
      type="text"
      name="name"
      required
    />
  </div>
</form>

function renderStars(rating) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? 'gold' : '#ccc', fontSize: '24px' }}>
        &#9733;
      </span>
    );
  }
  return <div>{stars}</div>;
}

export default function VehicleCard({ vehicle }) {
  const { reviews } = vehicle;

  if(reviews.length == 0){
    return <div>There are no reviews. Be the first one to review this car!{form}</div>
  }

  return (
    <div>
      {form}
      --------
      <div>{reviews.map(review => (
        <div>
          {review.reviewerName}
          {renderStars(review.reviewStars)}
          {review.reviewDesc}
          {review.reviewDate}
        </div>
        ))}
      </div>
    </div>
  );
}
