import '../App.css'
import axios from "axios";
import { useEffect, useState } from "react"

const Suggestedaccounts = () => {

    const [items, setItems] = useState(null)

    const getAccounts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/users")
            const data = response.data

            setItems(data)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect( () => {
        getAccounts()
    }, [items])
    const accounts = items

    if (!(accounts == null)) {

      return (
          <>
              {accounts.map((account) => (
                  <>
                      <div className="row">
                          <img className="profile-picture" src={account.profile_pic_url} alt="loading"/>
                          <div className="sidebar-profile-account-description">
                              <div className="description">
                              <p className="username">
                                  {account.first_name}
                              </p>
                              <p className="gender">
                                  {account.gender}
                              </p>
                              </div>
                          </div>
                      </div>
              </>
              ))}
          </>
      )
    }
}



export default Suggestedaccounts
