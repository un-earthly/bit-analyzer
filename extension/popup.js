const mockJobs = [
    {
        id: 1,
        company: "TechCorp Inc.",
        position: "Senior Software Engineer",
        analyzedDate: "2025-01-15",
        status: "applied",
        matchScore: 92,
        url: "https://techcorp.com/careers/senior-engineer"
    },
    {
        id: 2,
        company: "DataFlow Systems",
        position: "Full Stack Developer",
        analyzedDate: "2025-01-12",
        status: "completed",
        matchScore: 88,
        url: "https://dataflow.com/jobs/fullstack"
    },
    {
        id: 3,
        company: "InnovateLab",
        position: "Product Manager",
        analyzedDate: "2025-01-10",
        status: "analyzing",
        matchScore: 76,
        url: "https://innovatelab.com/careers/pm"
    },
    {
        id: 4,
        company: "CloudTech Solutions",
        position: "DevOps Engineer",
        analyzedDate: "2025-01-08",
        status: "completed",
        matchScore: 94,
        url: "https://cloudtech.com/jobs/devops"
    }
];

const mockMails = [
    {
        id: 1,
        subject: "Application for Senior Software Engineer - TechCorp",
        recipient: "hr@techcorp.com",
        sentDate: "2025-01-16",
        opens: 3,
        clicks: 1,
        downloads: 1
    },
    {
        id: 2,
        subject: "Full Stack Developer Application - DataFlow",
        recipient: "careers@dataflow.com",
        sentDate: "2025-01-13",
        opens: 1,
        clicks: 0,
        downloads: 0
    }
];

// Navigation function
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Job analysis function
function analyzeJob(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('analyze-btn');
    const jobUrl = document.getElementById('job-url').value;

    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Analyzing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Add new job to mock data
        const newJob = {
            id: mockJobs.length + 1,
            company: "New Company",
            position: "Extracted Position",
            analyzedDate: new Date().toISOString().split('T')[0],
            status: "analyzing",
            matchScore: Math.floor(Math.random() * 30) + 70,
            url: jobUrl
        };

        mockJobs.unshift(newJob);
        renderJobsTable();

        // Reset form
        document.getElementById('job-url').value = '';
        submitBtn.innerHTML = 'Analyze Job';
        submitBtn.disabled = false;

        // Update stats
        document.getElementById('total-analyzed').textContent = mockJobs.length;
    }, 2000);
}

// Render jobs table
function renderJobsTable() {
    const tbody = document.getElementById('jobs-table-body');
    tbody.innerHTML = '';

    mockJobs.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td><strong>${job.company}</strong></td>
                    <td>${job.position}</td>
                    <td>${new Date(job.analyzedDate).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${job.status}">${job.status}</span></td>
                    <td><strong>${job.matchScore}%</strong></td>
                    <td>
                        <button class="action-btn" onclick="viewJobDetails(${job.id})">
                            View Details
                        </button>
                    </td>
                `;
        tbody.appendChild(row);
    });
}

// Render mail tracking
function renderMailTracking() {
    const mailList = document.getElementById('mail-list');
    mailList.innerHTML = '';

    if (mockMails.length === 0) {
        mailList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📧</div>
                        <h3>No emails tracked yet</h3>
                        <p>Your tracked application emails will appear here.</p>
                    </div>
                `;
        return;
    }

    mockMails.forEach(mail => {
        const mailItem = document.createElement('div');
        mailItem.className = 'mail-item';
        mailItem.innerHTML = `
                    <div class="mail-header">
                        <div class="mail-subject">${mail.subject}</div>
                        <div class="status-badge status-applied">Sent</div>
                    </div>
                    <div style="color: #718096; font-size: 0.9rem;">
                        To: ${mail.recipient} • Sent: ${new Date(mail.sentDate).toLocaleDateString()}
                    </div>
                    <div class="mail-stats">
                        <div class="mail-stat">
                            <div class="mail-stat-number">${mail.opens}</div>
                            <div class="mail-stat-label">Opens</div>
                        </div>
                        <div class="mail-stat">
                            <div class="mail-stat-number">${mail.clicks}</div>
                            <div class="mail-stat-label">Clicks</div>
                        </div>
                        <div class="mail-stat">
                            <div class="mail-stat-number">${mail.downloads}</div>
                            <div class="mail-stat-label">Downloads</div>
                        </div>
                    </div>
                `;
        mailList.appendChild(mailItem);
    });
}

// View job details function
function viewJobDetails(jobId) {
    const job = mockJobs.find(j => j.id === jobId);
    alert(`Job Details for ${job.company} - ${job.position}\n\nMatch Score: ${job.matchScore}%\nStatus: ${job.status}\n\nIn a real application, this would open a detailed dashboard with:\n- Company research\n- Tailored resume\n- Cover letter\n- Email template\n- Application screenshot`);
}

// Add event listeners to navigation buttons
document.addEventListener('DOMContentLoaded', function () {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            const sectionId = button.getAttribute('data-section');
            showSection(sectionId);

            // Remove active class from all buttons and add to the clicked one
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    renderJobsTable();
    renderMailTracking();
});