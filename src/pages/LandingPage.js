import React, { useState } from "react"
import { ReactComponent as Logo } from "../assets/images/superChatLogo.svg"
import CustomModal from "../components/CustomModal"
import { base_url, icons } from "../utility/constants"
import { encodeColor, sendRequest } from "../utility/helpers"

export default function LandingPage() {
  // modal
  const [iconsModal, setIconsModal] = useState(false)
  const toggleIconsModal = () => {
    setIconsModal(!iconsModal)
  }

  // controlled data
  const [data, setData] = useState({
    color: "#22b2f0",
    icon: "",
    username: "",
    repositoryName: "",
    link: "",
    error: false,
  })

  // handleChange
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      error: false,
      link: "",
    })
  }
  const handleIconChange = (icon) => {
    console.log(icon)
    setData({ ...data, icon })
    toggleIconsModal()
  }

  // Loading
  const [loading, setLoading] = useState(false)

  //request
  const checkUserNameRepo = async () => {
    const { username, repositoryName, icon, color } = data
    if (!username || !repositoryName) {
      setData({ ...data, error: true })
      return
    }
    setLoading(true)
    const request = await sendRequest(
      `${base_url}repos/${username}/${repositoryName}`,
      "GET"
    )
    if (request.status === 200) {
      setLoading(false)
      setData({
        ...data,
        link: `${
          window.location.origin
        }/details/${username}/${repositoryName}/${icon || "user"}/${encodeColor(
          color
        )}`,
      })
    } else {
      setLoading(false)
      setData({ ...data, error: true })
    }
  }
  const Icons = () => {
    return (
      <section className="flex flex-wrap justify-around">
        {Object.keys(icons).map((icon, key) => (
          <section
            className="w-1/3 mb-4 text-center cursor-pointer"
            onClick={() => handleIconChange(icon)}
            key={key}
          >
            <i
              className={`block ${icons[icon]} text-3xl hover:text-blue-300`}
              key={key}
            />
          </section>
        ))}
      </section>
    )
  }
  return (
    <section className="h-screen flex flex-col justify-center items-center ">
      {/* Generated Link */}
      {data.link && (
        <section className="mb-6 px-8">
          <a
            href={data.link}
            _blank="true"
            className="shadow-md block w-full bg-gray-100 hover:bg-gray-200 text-blue-400 font-semibold text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            {data.link}
          </a>
        </section>
      )}

      <section className="w-full  max-w-md">
        {/* Form */}
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <section className="flex justify-center mb-4">
            <Logo className="w-64" />
          </section>
          <section className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username *
            </label>
            <input
              className={`shadow appearance-none border ${
                data.error && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              id="username"
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
          </section>
          <section className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Name of Repository (Public) *
            </label>
            <input
              className={`shadow appearance-none border ${
                data.error && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              id="password"
              type="text"
              placeholder="Repository"
              name="repositoryName"
              onChange={handleChange}
            />
          </section>
          <section className="mb-6 flex justify-between font-bold italic">
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-xs" style={{ color: data.color }}>
                Select Color
              </span>
              <input
                type="color"
                className="focus:outline-0 border-0  w-5 h-5"
                name="color"
                value={data.color}
                onChange={handleChange}
              />
            </label>
            <section
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleIconsModal()}
            >
              {data.icon ? (
                <i className={`${icons[data.icon]}`}></i>
              ) : (
                <span className="text-xs">Select Icon</span>
              )}
              <i className="far fa-edit"></i>
            </section>
          </section>

          <section className="">
            <button
              className=" block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex justify-center items-center"
              type="button"
              disabled={loading}
              onClick={checkUserNameRepo}
            >
              <span>Get Link</span>
              {loading && (
                <svg
                  className="animate-spin h-3 w-3 ml-3 bg-white ..."
                  viewBox="0 0 24 24"
                ></svg>
              )}
            </button>
          </section>

          {/* Error */}
          {data.error && (
            <p className="mt-3 text-red-500 text-xs italic">
              Something went wrong, check username and repository
            </p>
          )}
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2021 SuperChat Challenge. All rights reserved.
        </p>
      </section>

      <CustomModal
        title="Select Color"
        isOpen={iconsModal}
        toggleModal={toggleIconsModal}
      >
        <Icons />
      </CustomModal>
    </section>
  )
}
