import React from 'react'
import Table from '../components/Pagination';

const jadval = {
  "nom": "Bundesliga",
  "tur": "3",
  "jamoa": "Verder",
}

const select = [
  {
    "id": 1,
    "nomi": "Bundesliga",
    "ega": {
      "id": 1,
      "nom": "VFL"
    }
  },
  {
    "id": 8,
    "nomi": "APL",
    "ega": {
      "id": 2,
      "nom": "Taxminlar ligasi"
    }
  }
]

const TurnirJadvali = () => {

  return (
    <div className='container my-5'>
      <div className="row w-100">
        <div className="col-6">
          <h3>{jadval.nom}</h3>
        </div>
        <div className="col-6">
          <select name="" id="tur_select" className="form-control float-end w-75">
            <option value="">Choose Liga</option>
            {select.map((el) =>
              <option key={el.id} value={el.id}>{el.nomi}</option>
            )}
          </select>
        </div>
      </div>
      <Table />
    </div>
  )
}

export default TurnirJadvali;