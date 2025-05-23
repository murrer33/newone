/**
 * Google Forms Integration Utilities
 * This file provides functions for submitting data to Google Forms
 */

interface WaitlistFormData {
  email: string;
  name?: string;
  preferredPlan?: string;
  additionalInfo?: string;
}

/**
 * Submits waitlist data to a Google Form
 * @param formData Object containing waitlist form data
 * @param googleFormId The ID of the Google Form to submit to
 * @returns Promise that resolves to a boolean indicating success or failure
 */
export const submitToGoogleForm = async (
  formData: WaitlistFormData,
  googleFormId: string = '1FAIpQLSeM2Nd8SyjZh_P1CM-TXcmbeDVcuYdz-GzkERKPB7MXOl8v3g'
): Promise<boolean> => {
  try {
    // Get the pre-filled form URL with our data
    // Note: entry.123456789 fields need to be replaced with your actual form field IDs
    const formUrl = new URL(`https://docs.google.com/forms/d/e/${googleFormId}/formResponse`);
    
    // Map our form fields to Google Forms entry IDs
    // You need to replace these with your actual form field entry IDs
    const formEntryIds = {
      email: 'entry.957637257',
      name: 'entry.603841953',
      preferredPlan: 'entry.469695349',
      additionalInfo: 'entry.1163445299'
    };
    
    // Add parameters to URL
    if (formData.email) {
      formUrl.searchParams.append(formEntryIds.email, formData.email);
    }
    
    if (formData.name) {
      formUrl.searchParams.append(formEntryIds.name, formData.name);
    }
    
    if (formData.preferredPlan) {
      formUrl.searchParams.append(formEntryIds.preferredPlan, formData.preferredPlan);
    }
    
    if (formData.additionalInfo) {
      formUrl.searchParams.append(formEntryIds.additionalInfo, formData.additionalInfo);
    }
    
    // Use fetch to submit the form
    // Note: Using no-cors mode because Google Forms doesn't support CORS for form submissions
    const response = await fetch(formUrl.toString(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Since we're using no-cors, we won't get a meaningful response
    // So we'll assume success if no errors were thrown
    console.log('Waitlist data submitted');
    return true;
  } catch (error) {
    console.error('Error submitting to Waitlist:', error);
    return false;
  }
};

/**
 * Submits waitlist data to Google Form using an iframe (alternative method)
 * This method doesn't trigger CORS issues since it loads the form in an iframe
 * @param formData Object containing waitlist form data
 * @param googleFormId The ID of the Google Form to submit to
 * @returns URL string for the iframe source
 */
export const getGoogleFormIframeUrl = (
  formData: WaitlistFormData,
  googleFormId: string = '1FAIpQLSeM2Nd8SyjZh_P1CM-TXcmbeDVcuYdz-GzkERKPB7MXOl8v3g'
): string => {
  // Get the pre-filled form URL with our data
  const formUrl = new URL(`https://docs.google.com/forms/d/e/${googleFormId}/viewform`);
  
  // Map our form fields to Google Forms entry IDs
  // You need to replace these with your actual form field entry IDs
  const formEntryIds = {
      email: 'entry.957637257',
      name: 'entry.603841953',
      preferredPlan: 'entry.469695349',
      additionalInfo: 'entry.1163445299'
  };
  
  // Add parameters to URL
  if (formData.email) {
    formUrl.searchParams.append(formEntryIds.email, formData.email);
  }
  
  if (formData.name) {
    formUrl.searchParams.append(formEntryIds.name, formData.name);
  }
  
  if (formData.preferredPlan) {
    formUrl.searchParams.append(formEntryIds.preferredPlan, formData.preferredPlan);
  }
  
  if (formData.additionalInfo) {
    formUrl.searchParams.append(formEntryIds.additionalInfo, formData.additionalInfo);
  }
  
  return formUrl.toString();
}; 