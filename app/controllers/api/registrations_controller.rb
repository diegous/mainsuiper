class Api::RegistrationsController < Devise::RegistrationsController
  # acts_as_token_authentication_handler_for User

  # skip_before_action :authenticate_entity_from_token!, only: [:create]
  # skip_before_action :authenticate_entity!, only: [:create]

  skip_before_action :authenticate_scope!

  # POST /users
  def create
    build_resource sign_up_params

    if resource.save
      sign_up(resource_name, resource)
      render json: { id: resource.id, email: resource.email },
             status: :created
    else
      clean_up_passwords resource
      render json: { errors: resource.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.fetch(:user).permit(
      :password,
      :passwordConfirmation,
      :email
    )
  end
end
