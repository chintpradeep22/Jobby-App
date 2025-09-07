import { Component } from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
    state = {
        jobItemDetails: {},
        similarJobs: [],
        apiStatus: apiStatusConstants.initial,
    }

    componentDidMount() {
        this.getJobCardItemDetails()
    }

    getJobCardItemDetails = async () => {
        this.setState({ apiStatus: apiStatusConstants.inProgress })
        const { match } = this.props
        const { params } = match
        const { id } = params
        const apiUri = `https://apis.ccbp.in/jobs/${id}`
        const jwtToken = Cookies.get('jwt_token')
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }

        const response = await fetch(apiUri, options)
        if (response.ok) {
            const data = await response.json()
            const updatedJobDetails = {
                id: data.job_details.id,
                title: data.job_details.title,
                companyLogoUrl: data.job_details.company_logo_url,
                companyWebsiteUrl: data.job_details.company_website_url,
                employmentType: data.job_details.employment_type,
                jobDescription: data.job_details.job_description,
                location: data.job_details.location,
                packagePerAnnum: data.job_details.package_per_annum,
                rating: data.job_details.rating,
                skills: data.job_details.skills.map(skill => ({
                    name: skill.name,
                    imageUrl: skill.image_url,
                })),
                lifeAtCompany: {
                    description: data.job_details.life_at_company.description,
                    imageUrl: data.job_details.life_at_company.image_url,
                },
            }

            const updatedSimilarJobs = data.similar_jobs.map(job => ({
                id: job.id,
                title: job.title,
                companyLogoUrl: job.company_logo_url,
                employmentType: job.employment_type,
                jobDescription: job.job_description,
                location: job.location,
                rating: job.rating,
            }))

            this.setState({
                jobItemDetails: updatedJobDetails,
                similarJobs: updatedSimilarJobs,
                apiStatus: apiStatusConstants.success,
            })
        } else {
            this.setState({ apiStatus: apiStatusConstants.failure })
        }
    }

    renderSkills = skills => (
        <ul className="skills-list">
            {skills.map(skill => (
                <li key={skill.name} className="skill-item">
                    <img src={skill.imageUrl} alt={skill.name} className="skill-icon" />
                    <p>{skill.name}</p>
                </li>
            ))}
        </ul>
    )

    renderSimilarJobs = similarJobs => (
        <div className="similar-jobs">
            <h2>Similar Jobs</h2>
            <ul className="similar-jobs-list">
                {similarJobs.map(job => (
                    <li key={job.id} className="similar-job-card">
                        <img
                            src={job.companyLogoUrl}
                            alt="similar job company logo"
                            className="similar-job-logo"
                        />
                        <div className="similar-job-info">
                            <h3>{job.title}</h3>
                            <p>⭐ {job.rating}</p>
                            <h4>Description</h4>
                            <p>{job.jobDescription}</p>
                            <div className="job-meta">
                                <p>📍 {job.location}</p>
                                <p>💼 {job.employmentType}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )

    renderJobDetails = () => {
        const { jobItemDetails, similarJobs } = this.state
        const {
            title,
            companyLogoUrl,
            companyWebsiteUrl,
            employmentType,
            jobDescription,
            location,
            packagePerAnnum,
            rating,
            skills,
            lifeAtCompany,
        } = jobItemDetails

        return (
            <div className="job-details-container">
                <div className="job-details-card">
                    <img
                        src={companyLogoUrl}
                        alt="job details company logo"
                        className="job details company logo"
                    />
                    <div className="job-title-rating">
                        <h2>{title}</h2>
                        <p>⭐ {rating}</p>
                    </div>
                    <div className="job-meta">
                        <p>📍 {location}</p>
                        <p>💼 {employmentType}</p>
                        <p className="package">{packagePerAnnum}</p>
                    </div>
                    <hr />
                    <h3>Description</h3>
                    <div className="job-description">
                        <p>{jobDescription}</p>
                        <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                            Visit ↗
                        </a>
                    </div>
                    <h3>Skills</h3>
                    {this.renderSkills(skills)}
                    <h3>Life at Company</h3>
                    <div className="life-at-company">
                        <p>{lifeAtCompany.description}</p>
                        <img
                            src={lifeAtCompany.imageUrl}
                            alt="life at company"
                            className="life at company"
                        />
                    </div>
                </div>
                {this.renderSimilarJobs(similarJobs)}
            </div>
        )
    }

    renderLoading = () => (
        <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
    )

    renderJobFailure = () => (
        <>
            <img
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button
                type="button"
                data-testid="button"
                onClick={this.getJobCardItemDetails}
            >
                Retry
            </button>
        </>
    )

    renderContent = () => {
        const { apiStatus } = this.state
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return this.renderLoading()
            case apiStatusConstants.success:
                return this.renderJobDetails()
            case apiStatusConstants.failure:
                return this.renderJobFailure()
            default:
                return null
        }
    }

    render() {
        return (
            <>
                <Header />
                {this.renderContent()}
            </>
        )
    }
}

export default JobItemDetails
