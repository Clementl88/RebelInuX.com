/// governance.js - Governance Portal page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initGovernancePage, 300);
});

function initGovernancePage() {
  console.log('Initializing Governance Portal page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize governance data
  initGovernanceData();
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize voting functionality
  initVoting();
  
  // Initialize proposal form
  initProposalForm();
  
  // Initialize file upload
  initFileUpload();
}

// ========== AOS ANIMATIONS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768 ? 'mobile' : false
    });
    
    // Refresh AOS on window resize
    window.addEventListener('resize', function() {
      AOS.refresh();
    });
  }
}

// ========== MOBILE DROPDOWN FUNCTIONALITY ==========
function initializeMobileDropdown() {
  const dropbtn = document.querySelector('.dropbtn');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!dropbtn) return;
  
  // Mobile dropdown toggle
  dropbtn.addEventListener('click', function(e) {
    // Only handle on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdownContent = this.nextElementSibling;
      const isActive = dropdownContent.style.display === 'block' || 
                      dropdownContent.classList.contains('active');
      
      // Toggle this dropdown
      if (!isActive) {
        dropdownContent.style.display = 'block';
        dropdownContent.classList.add('active');
        this.classList.add('active');
      } else {
        dropdownContent.style.display = 'none';
        dropdownContent.classList.remove('active');
        this.classList.remove('active');
      }
    }
  });
}

// ========== GOVERNANCE DATA FUNCTIONS ==========
function initGovernanceData() {
  console.log('Initializing governance data');
  
  // Fetch and update governance stats
  updateGovernanceStats();
  
  // Initialize voting data
  initVotingData();
  
  // Start periodic updates
  setInterval(updateGovernanceStats, 60000); // Update every minute
}

async function updateGovernanceStats() {
  try {
    // In a real implementation, you would fetch these from APIs
    const stats = {
      totalProposals: 12,
      activeVotes: 3,
      totalVoters: 245,
      votingPower: 2.5
    };
    
    // Update stat counters with animation
    animateCounter('totalProposals', stats.totalProposals);
    animateCounter('activeVotes', stats.activeVotes);
    animateCounter('totalVoters', stats.totalVoters);
    document.getElementById('votingPower').textContent = stats.votingPower + 'M';
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating governance stats:', error);
  }
}

function initVotingData() {
  // Initialize vote progress animations
  document.querySelectorAll('.stat-fill').forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0%';
    
    setTimeout(() => {
      fill.style.width = width;
    }, 500);
  });
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const current = parseInt(element.textContent) || 0;
  if (current === target) return;
  
  const duration = 1000; // 1 second
  const increment = (target - current) / (duration / 16);
  
  let currentValue = current;
  const timer = setInterval(() => {
    currentValue += increment;
    if ((increment > 0 && currentValue >= target) || (increment < 0 && currentValue <= target)) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(currentValue);
    }
  }, 16);
}

function updateLastUpdated() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${timeString}`;
  }
}

// ========== VOTING FUNCTIONALITY ==========
function initVoting() {
  const voteButtons = document.querySelectorAll('.vote-button');
  
  voteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

function voteFor(button) {
  showVoteConfirmation('For', button);
}

function voteAgainst(button) {
  showVoteConfirmation('Against', button);
}

function voteAbstain(button) {
  showVoteConfirmation('Abstain', button);
}

function showVoteConfirmation(voteType, button) {
  const voteCard = button.closest('.vote-card');
  const proposalTitle = voteCard.querySelector('h3').textContent;
  const proposalId = proposalTitle.split('#')[1]?.split(':')[0] || 'Unknown';
  
  if (confirm(`Are you sure you want to vote ${voteType} on Proposal #${proposalId}?\n\nThis action will connect your wallet and submit an on-chain transaction.`)) {
    simulateVote(button, voteType);
  }
}

function simulateVote(button, voteType) {
  const originalHTML = button.innerHTML;
  const originalText = button.textContent;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Voting...';
  button.disabled = true;
  
  // Simulate wallet connection and transaction
  setTimeout(() => {
    // In a real implementation, you would:
    // 1. Connect wallet
    // 2. Sign transaction
    // 3. Submit vote on-chain
    
    showToast(`Successfully voted ${voteType} on proposal!`, 'success');
    
    // Reset button after delay
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.textContent = originalText;
      button.disabled = false;
      
      // Update UI to show user voted
      button.innerHTML = `<i class="fas fa-check-circle"></i> Voted ${voteType}`;
      button.style.background = voteType === 'For' ? 'rgba(76, 175, 80, 0.3)' : 
                               voteType === 'Against' ? 'rgba(255, 51, 102, 0.3)' : 
                               'rgba(158, 158, 158, 0.3)';
      
    }, 2000);
    
  }, 1500);
}

// ========== PROPOSAL FORM FUNCTIONALITY ==========
function initProposalForm() {
  const form = document.querySelector('.proposal-form');
  if (!form) return;
  
  // Character counters
  const titleInput = document.getElementById('proposalTitle');
  const descriptionTextarea = document.getElementById('proposalDescription');
  
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      const count = this.value.length;
      const hint = this.nextElementSibling;
      if (hint && hint.classList.contains('form-hint')) {
        hint.textContent = `${count}/100 characters`;
      }
    });
  }
  
  if (descriptionTextarea) {
    descriptionTextarea.addEventListener('input', function() {
      const count = this.value.length;
      const hint = this.nextElementSibling;
      if (hint && hint.classList.contains('form-hint')) {
        const min = 500;
        if (count < min) {
          hint.textContent = `${count}/${min} characters (minimum ${min})`;
          hint.style.color = '#f44336';
        } else {
          hint.textContent = `${count} characters ✓`;
          hint.style.color = '#4CAF50';
        }
      }
    });
  }
  
  // Form validation
  const submitButton = form.querySelector('button[onclick="submitProposal()"]');
  if (submitButton) {
    submitButton.addEventListener('click', validateProposalForm);
  }
}

function initFileUpload() {
  const fileInput = document.getElementById('proposalFiles');
  const fileList = document.getElementById('fileList');
  
  if (!fileInput || !fileList) return;
  
  fileInput.addEventListener('change', function() {
    fileList.innerHTML = '';
    
    if (this.files.length > 0) {
      Array.from(this.files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
          <span>${file.name} (${formatFileSize(file.size)})</span>
          <button type="button" onclick="removeFile(${index})">
            <i class="fas fa-times"></i>
          </button>
        `;
        fileList.appendChild(fileItem);
      });
    }
  });
}

function removeFile(index) {
  const fileInput = document.getElementById('proposalFiles');
  const files = Array.from(fileInput.files);
  files.splice(index, 1);
  
  // Create new FileList (simulated)
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
  
  // Refresh file list display
  fileInput.dispatchEvent(new Event('change'));
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function saveDraft() {
  const formData = getFormData();
  localStorage.setItem('proposalDraft', JSON.stringify(formData));
  showToast('Proposal draft saved locally', 'info');
}

function previewProposal() {
  const formData = getFormData();
  
  // Basic validation
  if (!formData.title || formData.title.length < 10) {
    showToast('Please enter a valid proposal title (minimum 10 characters)', 'error');
    return;
  }
  
  if (!formData.category) {
    showToast('Please select a proposal category', 'error');
    return;
  }
  
  if (!formData.description || formData.description.length < 500) {
    showToast('Please provide a detailed description (minimum 500 characters)', 'error');
    return;
  }
  
  // Show preview (in real implementation, open modal or new page)
  showToast('Opening proposal preview...', 'info');
  
  // Simulate preview
  setTimeout(() => {
    const preview = `
      Proposal Preview:
      
      Title: ${formData.title}
      Category: ${formData.category}
      $REBL Requested: ${formData.amount || 'None'}
      
      Description:
      ${formData.description.substring(0, 200)}...
      
      Files: ${formData.files?.length || 0} attached
    `;
    
    alert(preview + '\n\n(Full preview would be shown in a modal)');
  }, 500);
}

function submitProposal() {
  const formData = getFormData();
  
  // Validate form
  if (!validateProposalForm()) {
    return;
  }
  
  // Simulate proposal submission
  showToast('Submitting proposal to governance system...', 'info');
  
  const submitButton = document.querySelector('button[onclick="submitProposal()"]');
  const originalHTML = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitButton.disabled = true;
  
  setTimeout(() => {
    // In a real implementation, you would:
    // 1. Connect wallet
    // 2. Check token balance (minimum 10,000 $REBL)
    // 3. Sign and submit transaction
    // 4. Get proposal ID
    
    showToast('Proposal submitted successfully!', 'success');
    
    // Reset form
    resetProposalForm();
    
    // Reset button
    submitButton.innerHTML = originalHTML;
    submitButton.disabled = false;
    
    // Show proposal ID
    const proposalId = Math.floor(Math.random() * 1000) + 13;
    setTimeout(() => {
      showToast(`Your proposal has been submitted with ID #${proposalId}. It will now enter the 7-day discussion period.`, 'info', 5000);
    }, 1000);
    
  }, 2000);
}

function getFormData() {
  return {
    title: document.getElementById('proposalTitle')?.value || '',
    category: document.getElementById('proposalCategory')?.value || '',
    description: document.getElementById('proposalDescription')?.value || '',
    amount: document.getElementById('proposalAmount')?.value || '',
    files: document.getElementById('proposalFiles')?.files || []
  };
}

function validateProposalForm() {
  const formData = getFormData();
  let isValid = true;
  
  // Validate title
  if (!formData.title || formData.title.length < 10) {
    showToast('Title must be at least 10 characters long', 'error');
    isValid = false;
  }
  
  // Validate category
  if (!formData.category) {
    showToast('Please select a proposal category', 'error');
    isValid = false;
  }
  
  // Validate description
  if (!formData.description || formData.description.length < 500) {
    showToast('Description must be at least 500 characters long', 'error');
    isValid = false;
  }
  
  // Validate amount if provided
  if (formData.amount && (isNaN(formData.amount) || parseFloat(formData.amount) < 0)) {
    showToast('Please enter a valid $REBL amount', 'error');
    isValid = false;
  }
  
  return isValid;
}

function resetProposalForm() {
  document.getElementById('proposalTitle').value = '';
  document.getElementById('proposalCategory').selectedIndex = 0;
  document.getElementById('proposalDescription').value = '';
  document.getElementById('proposalAmount').value = '';
  document.getElementById('proposalFiles').value = '';
  document.getElementById('fileList').innerHTML = '';
  
  // Reset character counters
  const hints = document.querySelectorAll('.form-hint');
  hints.forEach(hint => {
    if (hint.previousElementSibling.id === 'proposalTitle') {
      hint.textContent = 'Maximum 100 characters';
    } else if (hint.previousElementSibling.id === 'proposalDescription') {
      hint.textContent = 'Minimum 500 characters required';
      hint.style.color = '';
    }
  });
  
  localStorage.removeItem('proposalDraft');
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.principle-item, .vote-card, .guide-card, .faq-item, .related-card, .process-step'
  );
  
  // Use Intersection Observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', animateElements);
    animateElements(); // Initial check
  }
}

function animateElements() {
  const animatedElements = document.querySelectorAll(
    '.principle-item, .vote-card, .guide-card, .faq-item, .related-card, .process-step'
  );
  
  animatedElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
    
    if (isVisible) {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 50);
    }
  });
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Style toast
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  
  document.body.appendChild(toast);
  
  // Add animation styles if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// ========== GLOBAL EXPORTS ==========
window.voteFor = voteFor;
window.voteAgainst = voteAgainst;
window.voteAbstain = voteAbstain;
window.saveDraft = saveDraft;
window.previewProposal = previewProposal;
window.submitProposal = submitProposal;
window.removeFile = removeFile;
window.initializeMobileDropdown = initializeMobileDropdown;
window.showToast = showToast;

// Add touch-active class styles
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .touch-active {
      opacity: 0.7 !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
    
    .file-upload:active {
      border-color: var(--rebel-gold) !important;
      background: rgba(255, 204, 0, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
});

// Load draft if exists
window.addEventListener('load', function() {
  const draft = localStorage.getItem('proposalDraft');
  if (draft) {
    try {
      const formData = JSON.parse(draft);
      if (confirm('You have a saved proposal draft. Would you like to load it?')) {
        loadDraft(formData);
      }
    } catch (e) {
      console.error('Error loading draft:', e);
    }
  }
});

function loadDraft(formData) {
  document.getElementById('proposalTitle').value = formData.title || '';
  document.getElementById('proposalCategory').value = formData.category || '';
  document.getElementById('proposalDescription').value = formData.description || '';
  document.getElementById('proposalAmount').value = formData.amount || '';
  
  // Trigger input events to update character counters
  document.getElementById('proposalTitle').dispatchEvent(new Event('input'));
  document.getElementById('proposalDescription').dispatchEvent(new Event('input'));
  
  showToast('Proposal draft loaded', 'info');
}
