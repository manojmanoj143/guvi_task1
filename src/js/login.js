$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Serialize form data
        var formData = $(this).serialize();

        // Perform AJAX request
        $.ajax({
            url: 'http://localhost:8000/login.php', // Adjust the URL as needed
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    // Store the token in localStorage
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user_id', response.user_id);

                    // Redirect to profile page or another page
                    window.location.href = 'profile.html'; // Adjust the redirect URL as needed
                } else {
                    // Display error message
                    $('#message').html(response.message);
                }
            },
            error: function(xhr, status, error) {
                // Display error message
                $('#message').html('An error occurred: ' + error);
            }
        });
    });
});
