import React, { useEffect, useState } from "react"
import { base_url, icons } from "../utility/constants"
import { sendRequest, decodeColor, capitalize } from "../utility/helpers"
import CustomModal from "../components/CustomModal"

export default function DetailsPage({ match }) {
  const {
    params: { username, repositoryName, icon, color },
  } = match

  const [data, setData] = useState({
    repository: null,
    contributors: null,
  })
  async function getData() {
    try {
      const [repoReq, contributorsReq] = await Promise.all([
        (
          await sendRequest(`${base_url}repos/${username}/${repositoryName}`)
        ).json(),
        (
          await sendRequest(
            `${base_url}repos/${username}/${repositoryName}/contributors`
          )
        ).json(),
      ])

      setData({ ...data, repository: repoReq, contributors: contributorsReq })
    } catch (e) {}
  }

  useEffect(() => {
    getData()
  }, [])

  const [contributorsModal, setContributorsModal] = useState(false)
  const toggleContributorsModal = () => {
    setContributorsModal(!contributorsModal)
  }

  const { repository, contributors } = data

  const styles = {
    textColor: {
      color: decodeColor(color),
    },
    bgColor: {
      backgroundColor: decodeColor(color),
    },
    borderColor: {
      border: `1px solid ${decodeColor(color)}`,
    },
  }
  const Contributors = () => {
    return (
      <section className="space-y-3 max-h-80 overflow-auto">
        {contributors &&
          contributors.slice(0, 50).map((contributor, key) => (
            <a
              href={`${contributor?.html_url}`}
              className="shadow-inner block border-0 outline-none bg-gray-100 rounded-tl-lg rounded-br-lg p-3 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-3"
              key={key}
            >
              <h3
                className="mr-2 font-semibold font-optima"
                style={styles.textColor}
              >
                {key + 1}
              </h3>
              <section className="flex items-center sm:w-1/2">
                <section className="w-3/12">
                  <img
                    src={contributor?.avatar_url}
                    alt={`contributor-${key}`}
                    className="w-full rounded-full"
                    style={styles.borderColor}
                  />
                </section>

                <span
                  className="font-optima block sm::w-9/12 pl-2 break-words text-blue-600"
                  style={styles.textColor}
                >
                  {contributor?.login}
                </span>
              </section>
              <section
                style={styles.bgColor}
                className="text-white px-3 py-2 text-xs rounded-2xl sm:w-5/12 text-center"
              >
                <p className="font-optima-light font-bold">{`${contributor?.contributions} contributions`}</p>
              </section>
            </a>
          ))}
      </section>
    )
  }

  return (
    <section className="h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      {repository && contributors ? (
        <section className="w-full max-w-xl bg-white px-4 py-4">
          {/* Selected Icon */}
          <section className="flex justify-center mb-6 ">
            <section className="rounded-full shadow-md p-8">
              <i
                className={`${icons[icon]} text-8xl `}
                style={styles.textColor}
              />
            </section>
          </section>

          {/* Repository name and description */}
          <section className="mb-6">
            <h1 className="font-bold mb-4 font-optima text-xl">
              {capitalize(repository?.name)}
            </h1>
            <p className="leading-loose">{repository?.description}</p>
          </section>
          {/* Contributors */}
          <section className="w-full mb-6">
            <section className="w-full">
              <h2 className="font-semibold font-optima-light text-sm font-optima mb-3">
                Top Contributors
              </h2>
              <section className="flex flex-wrap w-full max-w-xs">
                {contributors &&
                  contributors.slice(0, 10).map((contributor, key) => (
                    <section
                      className="mb-2"
                      key={key}
                      style={{ marginRight: "-10px" }}
                    >
                      <img
                        src={contributor?.avatar_url}
                        alt={`contributor-${key}`}
                        className="w-10 rounded-full"
                        style={styles.borderColor}
                      />
                    </section>
                  ))}
              </section>
            </section>
          </section>

          <section className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
            {/* Repository meta data */}
            <section className="flex space-x-4 mb-6 sm:mb-0">
              <section
                className="flex items-baseline cursor-pointer"
                onClick={toggleContributorsModal}
              >
                <i className="fas fa-users mr-1" style={styles.textColor} />
                <section>
                  <span className="block mb-1 text-sm">
                    {contributors.length}
                  </span>
                  <span className="block text-xs text-gray-400">
                    Contributors
                  </span>
                </section>
              </section>
              <section className="flex items-baseline cursor-pointer">
                <i
                  className="fas fa-code-branch mr-1"
                  style={styles.textColor}
                />
                <section>
                  <span className="block mb-1 text-sm">
                    {repository?.forks_count}
                  </span>
                  <span className="block text-xs text-gray-400">Forks</span>
                </section>
              </section>
              <a
                className=" block flex items-baseline cursor-pointer"
                href={repository?.html_url}
              >
                <i className="far fa-star mr-1" style={styles.textColor} />
                <section>
                  <span className="block mb-1 text-sm">
                    {repository?.stargazers_count}
                  </span>
                  <span className="block text-xs text-gray-400">Stars</span>
                </section>
              </a>
            </section>

            {/* Author */}
            <section className="flex flex-col items-end">
              <section>
                <p
                  className="mb-3 text-xs font-semibold font-optima-light"
                  style={styles.textColor}
                >
                  Created By
                </p>
                <section className="flex items-center">
                  <img
                    src={repository?.owner?.avatar_url}
                    alt={repository?.owner?.login}
                    className="w-10 rounded-full mr-1"
                  />
                  <span className="font-bold font-optima">
                    {repository?.owner?.login}
                  </span>
                </section>
              </section>
            </section>
          </section>
          <CustomModal
            title="Select Color"
            isOpen={contributorsModal}
            toggleModal={toggleContributorsModal}
          >
            <Contributors />
          </CustomModal>
        </section>
      ) : (
        <svg
          className="animate-spin h-8 w-8"
          style={styles.bgColor}
          viewBox="0 0 24 24"
        ></svg>
      )}
    </section>
  )
}
