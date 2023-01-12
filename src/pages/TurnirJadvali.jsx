import React from 'react'

const jadval = {
  "nom": "Bundesliga",
  "tur": "3",
  "jamoa": "Verder",
  "turnirjadvali": [
    {
      "orin": 1,
      "nomi": "Gerta",
      "gol": 6,
      "otkazibyuborilgan": 1,
      "galaba": 3,
      "durang": 0,
      "maglubiyat": 0,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 2,
      "nomi": "Borussiya",
      "gol": 7,
      "otkazibyuborilgan": 7,
      "galaba": 2,
      "durang": 0,
      "maglubiyat": 1,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 3,
      "nomi": "Bayer",
      "gol": 6,
      "otkazibyuborilgan": 8,
      "galaba": 2,
      "durang": 0,
      "maglubiyat": 1,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 4,
      "nomi": "Leypzig",
      "gol": 6,
      "otkazibyuborilgan": 3,
      "galaba": 1,
      "durang": 1,
      "maglubiyat": 1,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 5,
      "nomi": "Hoffenhaym",
      "gol": 6,
      "otkazibyuborilgan": 3,
      "galaba": 1,
      "durang": 1,
      "maglubiyat": 1,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 6,
      "nomi": "Verder",
      "gol": 4,
      "otkazibyuborilgan": 3,
      "galaba": 1,
      "durang": 1,
      "maglubiyat": 1,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 7,
      "nomi": "Shalke 04",
      "gol": 2,
      "otkazibyuborilgan": 4,
      "galaba": 0,
      "durang": 1,
      "maglubiyat": 2,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 8,
      "nomi": "Bavariya",
      "gol": 4,
      "otkazibyuborilgan": 12,
      "galaba": 0,
      "durang": 0,
      "maglubiyat": 3,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 8,
      "nomi": "Bavariya",
      "gol": 4,
      "otkazibyuborilgan": 12,
      "galaba": 0,
      "durang": 0,
      "maglubiyat": 3,
      "status": 0,
      "profile_id": "12345678"
    },
    {
      "orin": 8,
      "nomi": "Bavariya",
      "gol": 4,
      "otkazibyuborilgan": 12,
      "galaba": 0,
      "durang": 0,
      "maglubiyat": 3,
      "status": 0,
      "profile_id": "12345678"
    }
  ]
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
  console.log(jadval);
  return (
    <div className='container my-5'>
      <div className="d-flex justify-content-center">
        <div className="row w-100">
          <div className="col-md-6">
            <h3>{jadval.nom}</h3>
          </div>
          <div className="col-md-6">
            <select name="" id="" className="form-control w-75 float-end">
              <option value="">Choose Liga</option>
              {select.map((el) =>
                <option key={el.id} value={el.id}>{el.nomi}</option>
              )}
            </select>
          </div>
        </div>
      </div>
      <div className="w-100 mt-4 table_div">
        <table class="table table-hover text-center table-responsive">
          <thead>
            <tr className=''>
              <th scope="col">O'rin</th>
              <th scope="col">Nomi</th>
              <th scope="col">Go'l</th>
              <th scope="col">O'tkazib Yuborilgan</th>
              <th scope="col">G'alaba</th>
              <th scope="col">Durang</th>
              <th scope="col">Mag'lubiyat</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {
              jadval.turnirjadvali.map(el => (
                <tr key={el.orin}>
                  <th scope="row">{el.orin}</th>
                  <td>{el.nomi}</td>
                  <td>{el.gol}</td>
                  <td>{el.otkazibyuborilgan}</td>
                  <td>{el.galaba}</td>
                  <td>{el.durang}</td>
                  <td>{el.maglubiyat}</td>
                  <td>{el.status}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TurnirJadvali