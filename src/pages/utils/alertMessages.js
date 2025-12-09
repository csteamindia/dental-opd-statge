import Swal from 'sweetalert2';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": 0,
    "extendedTimeOut": 0,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "tapToDismiss": false
}

// For More information got to this link: https://sweetalert2.github.io/

// Success Alert
export const showSuccessAlert = (message) => {
    // Swal.fire({
    //     title: message,
    //     icon: 'success',
    //     draggable: true,
    //     position: 'center',
    //     showConfirmButton: false,
    //     timerProgressBar: true,
    //     timer: 3000,
    // });

    toastr.success(message, 'Success', {
        timeOut: 1000,
        extendedTimeOut: 1000 
    });
};

export const showErroeAlert = (message) => {
    // Swal.fire({
    //     title: message,
    //     icon: 'success',
    //     draggable: true,
    //     position: 'center',
    //     showConfirmButton: false,
    //     timerProgressBar: true,
    //     timer: 3000,
    // });

    toastr.error(message, 'Error', {
        timeOut: 1000,
        extendedTimeOut: 1000 
    });
};

export const showConfirmAlert = async (
    title = "Are you sure?",
    message = "You won't be able to revert this!",
    confirmText = "Yes, delete it!",
    successTitle = "Deleted!",
    successMessage = "Your file has been deleted."
) => {
    const result = await Swal.fire({
        title: title,
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmText
    });

    if (result.isConfirmed) {
        // await Swal.fire({
        //     title: successTitle,
        //     text: successMessage,
        //     icon: "success",
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true
        // });
        
        toastr.success(successMessage, 'Success', {
            timeOut: 1000,
            extendedTimeOut: 1000 
        });
    }

    return result;
};

export const showDeleteConfirmation = async (onConfirm) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        onConfirm(); // Callback for delete action
        Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    }
};
export const showDeleteConfirmationWithText = async (onConfirm, message = 'Type DELETE to confirm') => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        input: 'text',
        inputPlaceholder: message,
        inputValidator: (value) => {
            if (value == '') {
                return 'You must type reason to cancel!';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
    });

    if (result.isConfirmed && result.value !== '') {
        // Call delete action
        onConfirm(result.value);

        // Show success message
        await Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    } else {
        console.log('Deletion cancelled or incorrect confirmation input');
    }
};