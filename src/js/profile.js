$(document).ready(function() {
    // Handle form submission
    $('#profileForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Retrieve the token from localStorage
        var token = localStorage.getItem('token');
        if (!token) {
            $('#message').html('You need to log in first.');
            return;
        }

        // Create a FormData object to handle file uploads and form data
        var formData = new FormData(this);
        formData.append('token', token);

        // Perform AJAX request to update profile
        $.ajax({
            url: 'http://localhost:8000/update_profile.php', // URL of the PHP script
            type: 'POST',
            data: formData,
            processData: false, // Important for file uploads
            contentType: false, // Important for file uploads
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#message').html('Profile updated successfully.');
                    // Optionally redirect to the dashboard or another page
                    window.location.href = 'dashboard.html';
                } else {
                    $('#message').html('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                $('#message').html('An error occurred: ' + error);
            }
        });
    });
});
