import {
  INIT_USER_STATE,
  CONTACT_ADD_START, CONTACT_ADD_SUCCESS, CONTACT_ADD_FAIL,
  CONTACT_UPDATE_START, CONTACT_UPDATE_SUCCESS, CONTACT_UPDATE_FAIL,
  CONTACT_FETCH_START, CONTACT_FETCH_SUCCESS, CONTACT_FETCH_FAIL,
  SIGN_OUT_ALL
} from '../actions/types';

const photo = 'http://profilepicturesdp.com/wp-content/uploads/2018/06/group-profile-pictures-8.jpg';

const comments = 'NativeBase includes components such as anatomy of your app screens, header, input, buttons, badge, icon, form, checkbox, radio-button, list, card, actionsheet, picker, segment, swipeable list, tabs, toast, drawer, thumbnail, spinner, layout, search bar etc. You can style these components with StyleSheet objects.';

const contactItem0 = {
  key: '0',
  photo: photo,
  name: 'John marshmallow the second',
  phone: '052-9998887',
  mail: 'name@mail.com',
  comments: comments
};

const contactItem1 = {
  key: '1',
  photo: photo,
  name: 'Mama',
  phone: '052-9998887',
  mail: 'name@mail.com',
  comments: comments
};

const contactItem2 = {
  key: '2',
  photo: photo,
  name: 'Baba',
  phone: '052-9998887',
  mail: 'name@mail.com',
  comments: comments
};

const contactItem3 = {
  key: '3',
  photo: photo,
  name: 'Danny',
  phone: '052-9998887',
  mail: 'name@mail.com',
  comments: comments
};

const contactItem4 = {
  key: '4',
  photo: photo,
  name: 'Mary',
  phone: '052-9998887',
  mail: 'name@mail.com',
  comments: comments
};

const INITIAL_STATE = {
  //contacts: [contactItem0, contactItem1, contactItem2, contactItem3, contactItem4],
  contacts: [],

  fetchInProgress: false,
  fetchError: '',

  addInProgress: false,
  addError: ''
};

export default function ContactReducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case INIT_USER_STATE:
      return INITIAL_STATE;

    case CONTACT_ADD_START:
      return { ...state, addInProgress: true, error: ''  };

    case CONTACT_ADD_SUCCESS:
      return { ...state, addInProgress: false, error: '' };

    case CONTACT_ADD_FAIL:
      return { ...state, addInProgress: false, error: action.payload  };

    case CONTACT_UPDATE_START:
      return { ...state, updateInProgress: true, error: ''  };

    case CONTACT_UPDATE_SUCCESS:
      return { ...state, updateInProgress: false, error: '' };

    case CONTACT_UPDATE_FAIL:
      return { ...state, updateInProgress: false, error: action.payload  };

    case CONTACT_FETCH_START:
      return { ...state, fetchInProgress: true };

    case CONTACT_FETCH_SUCCESS:
      if (!action.payload)
        return { ...state, fetchInProgress: false, contacts: [] };
      else {
        return { ...state, fetchInProgress: false, contacts: action.payload };
      }

    case CONTACT_FETCH_FAIL:
      return { ...state, fetchInProgress: false, error: action.payload };

    case SIGN_OUT_ALL:
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
