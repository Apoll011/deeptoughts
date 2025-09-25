[33mcommit f4fb41bd928dd478a8331b81d6bc893fb2f93aa8[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 15:06:57 2025 -0100

    minor fix

[33mcommit c7910433908bca8a612fe17bef8c8cc6b874ff36[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 15:05:16 2025 -0100

    feat(ThoughtEditor): add tag suggestion with autocomplete and introduce helper methods in ThoughtManager
    
    - Implemented tag autocomplete in `ThoughtEditor` using `useMemo` and `useEffect` for dynamic filtering of suggestions.
    - Added click and blur handlers to handle suggestion selection and visibility.
    - Updated `ThoughtManager` with helper methods (`allTags`, `allCategories`, `allMoods`, `allLocations`, `allWeather`) for centralized data retrieval and deduplication.
    - Enhanced UI with a dropdown for tag suggestions and styled interactions.

[33mcommit 583967ec0f8f3e45a63a0dc2d72884070bd21fae[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 14:41:38 2025 -0100

    refactor(Home): simplify state management for thoughts
    
    - Passed `thoughts` as a prop to `Home` instead of managing it internally.
    - Removed unnecessary `useMemo` logic for fetching thoughts within `Home`.
    - Updated `App` to handle thought fetching and pass it down to `Home`.
    - Minor type refactor in `UserRegistration` and `AppContext`.

[33mcommit 3e037fc835651f869c84b9e501143dacf1e88208[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 14:40:24 2025 -0100

    feat(Header): personalize header with user's name from AppContext
    
    - Incorporated `useAppContext` to fetch user data.
    - Updated header subtitle to dynamically display the logged-in user's name.

[33mcommit 0816ae9bf7b1d86f30811c75c6ae69933d9a2600[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 14:32:47 2025 -0100

    feat(AppContext): centralize state management with new AppContext
    
    - Introduced `AppContext` for centralized state and dependency management.
    - Replaced individual `ThoughtManager` and storage initialization in components with AppContext usage.
    - Updated key components (`Home`, `ThoughtEditor`, `ThoughtVisualizer`, etc.) to leverage `useAppContext`.
    - Added `AppProvider` to wrap the application for context availability.

[33mcommit 3b96ec1b55779e0ff6542513764ed6cbe791c262[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 14:02:24 2025 -0100

    style(UserRegistration): update button gradient to yellow-orange theme
    
    - Replaced green-blue gradient with a vibrant yellow-orange gradient for the Complete button.
    - Maintained hover and transition effects for consistency.

[33mcommit 96515c9b41714339097c3c1d5be78318c45e4f77[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 14:02:17 2025 -0100

    refactor(ThoughtEditor): remove preview mode logic and redundant dependencies
    
    - Removed the isPreview state and associated logic from ThoughtEditor.
    - Eliminated Eye icon and related preview button in the toolbar.
    - Deleted ThoughtVisualizer import and removed unused dependencies.
    - Marked preview-related TODO in documentation as completed.

[33mcommit cf4051c389db6bac3e3db4c4fb13e358d5cb7513[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 13:46:34 2025 -0100

    fix(UserRegistration): remove nonexisting gender options for true humans only, no animals
    
    - Limited gender options to 'male' and 'female' in both model and component.
    - Updated default gender selection and removed unexisting dropdown values.

[33mcommit 74463a2449f2fe6f8d5f113509f491301a908ae0[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 13:43:53 2025 -0100

    feat(Onboarding): add complete onboarding flow with feature showcase and app tour
    
    - Introduced a guided onboarding experience to enhance user engagement.
    - Includes Welcome screen, Feature Showcase, App Tour, and User Registration components.
    - Added LocalStorage integration to persist onboarding completion state.
    - Updated App to conditionally render onboarding flow based on completion status.

[33mcommit a3b95ab146c95098436f0b6e6cb6edadbbd42ece[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 13:10:33 2025 -0100

    Minor

[33mcommit 615c98cdf0e0d1239d5eb121c5672fc46d987336[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:56:19 2025 -0100

    fix(ThoughtVisualizer): improve header styling and title display
    
    - Made header sticky with backdrop blur and border for better visibility.
    - Truncated long titles in the header and ensured fallback for untitled thoughts.

[33mcommit 5ac00e8b9e8e3508d894aaad3a97318bf439a5a3[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:51:02 2025 -0100

    Minor fix

[33mcommit c51bdf8b28a0b6ba14ba20f21faebda950c1e89b[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:49:01 2025 -0100

    Minor improvment

[33mcommit 967bc04d393a0d8c31fd45b51556c1144443f315[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:47:04 2025 -0100

    Fixed bg color on the thought visualizer for consistency

[33mcommit f72c5910c44bc68e4d31074fbb9dd29a98a4bc9e[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:45:33 2025 -0100

    style(ThoughtEditor): update button gradient to yellow-orange theme
    
    - Replaced blue gradient with a vibrant yellow-orange gradient for Save and Add Tag buttons.
    - Maintained hover and disabled state styling.

[33mcommit 6c6e4a3c68295e0d1ef04388006e997bba15f8ea[m
Merge: 58a538f 111636e
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:41:02 2025 -0100

    Merge remote-tracking branch 'origin/master'

[33mcommit 58a538f737524f32dee591dc05429051493312e8[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:39:16 2025 -0100

    fix(ThoughtCard): safeguard against missing category values
    
    - Wrapped category spans in conditional checks to prevent rendering when no category is defined.
    - Ensured consistent styling for category labels throughout the component.

[33mcommit 111636e2a1fd0e93a5ff000964311b1a472a7af3[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:39:16 2025 -0100

    fix(ThoughtCard): safeguard against missing category values
    
    - Wrapped category spans in conditional checks to prevent rendering when no category is defined.
    - Ensured consistent styling for category labels throughout the component.

[33mcommit 57bb92c5528e5b89c1af80e038bb8c7ed7e1f2f6[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:31:29 2025 -0100

    Minor fix the the viewTitle generation for weeks

[33mcommit 84d81de4bd6a26f45fac471cdbc883f7b303b8ab[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:27:12 2025 -0100

    refactor(CalendarView): simplify rendering logic and enhance empty state message
    
    - Streamlined month view logic by optimizing date generation and removing unused components.
    - Added a clear and friendly message for months with no recorded thoughts.

[33mcommit 7890bd0338ce85d28e056b167e1399c30d61216a[m
Author: Apoll011 <tiagorobotik@gmail.com>
Date:   Fri Aug 22 12:21:01 2025 -0100

    refactor(CalendarView): remove redundant date rendering logic in week view
    
    - Simplified week view by removing duplicated components.
    - Enhanced date range formatting for consistent display.
