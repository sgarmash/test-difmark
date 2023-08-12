import $ from 'jquery';
import 'select2';
import '@/styles/index.scss';

(function($) {
  
  const dataMapping = {
    game: {
      EU: { price: 10 },
      DE: { price: 15 },
    },
  };

  let iconDefault = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="11" viewBox="0 0 20 11" fill="none">
                      <path d="M0 0.699997L10 10.7L20 0.699997H0Z"/>
                    </svg>`;

  let iconActive = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9.741 17.8021C9.50831 17.8021 9.29501 17.7168 9.1205 17.5248L5.26177 13.2802C4.91274 12.8963 4.91274 12.299 5.26177 11.9151C5.6108 11.5312 6.15374 11.5312 6.50277 11.9151L9.76039 15.4771L17.4972 6.98795C17.8463 6.60401 18.3892 6.60401 18.7382 6.98795C19.0873 7.37188 19.0873 7.96911 18.7382 8.35304L10.3809 17.5248C10.187 17.7168 9.97368 17.8021 9.741 17.8021Z" fill="#46CA43"/>
                    </svg>`;

  const $gameDetails = $('.game__datails');
  const $serverDetails = $('.server__details');
  const $fractionDetails = $('.fraction__details');
  const $rangeInput = $("input[type=range]");
  const $currencyInput = $('.form__currency-price__input');
  const $currencyCounter = $('.form__conter-gold');
  
  let isUpdatingRange = false;

  $.fn.select2.defaults.set("minimumResultsForSearch", -1);
  $.fn.select2.defaults.set("width", "100%");
  $.fn.select2.defaults.set("theme", "custom");
  
  
  $gameDetails.select2({ placeholder: 'Currency' });
  $serverDetails.select2({ placeholder: 'Server' });
  $fractionDetails.select2({ placeholder: 'Fraction' });

  $gameDetails.on('select2:select', function () {
    $serverDetails.add($currencyInput).prop('disabled', false);
    updateCurrencyCounter();
    $(this).next().addClass('select2-container--active');
    setIconBasedOnActiveState($(this));
  });
  
  $serverDetails.on('select2:select', function () {
    $fractionDetails.prop('disabled', false);
    $(this).next().addClass('select2-container--active');
    setIconBasedOnActiveState($(this));
  });
  
  $fractionDetails.on('select2:select', function () {
    $rangeInput.add($currencyInput).prop('disabled', false);
    $(this).next().addClass('select2-container--active');
    updateCurrencyCounter();
    setIconBasedOnActiveState($(this));
    $('.form__currency-confirm__button').prop('disabled', false);
  });

  $('.form__currency-confirm__button').on('click', function(){
    $('.form__currency-submit').removeClass('is--hidden');
  });

  $('.form__currency-submit__close').on('click', function(){
    $('.form__currency-submit').addClass('is--hidden');
  });

  $('.form__currency-submit__input').on('input', function(){
    const sanitizedValue = $(this).val().replace(/[^a-zA-Z]/g, '');
    $(this).val(sanitizedValue);
  });

  $(document).find('.select2').each(function () {
    setIconBasedOnDisabledState($(this));
  });
  
  $rangeInput.attr('min', 100).attr('max', 1000);
  
  function updateRangeBackgroundImage() {
    const rangeValue = parseInt($rangeInput.val());
    const val = (rangeValue - $rangeInput.attr('min')) / ($rangeInput.attr('max') - $rangeInput.attr('min'));
    const percent = val * 100;
  
    $rangeInput.css(
      'background-image',
      `-webkit-gradient(linear, left top, right top, 
        color-stop(${percent}%, #46CA43), 
        color-stop(${percent}%, #414D60)`
    );
  
    $rangeInput.css(
      'background-image',
      `-moz-linear-gradient(left center, #46CA43 0%, #46CA43 ${percent}%, #414D60 ${percent}%, #414D60 100%)`
    );

    // Update the currency counter
    updateCurrencyCounter();
  }
  
  function updateCurrencyCounter() {
    const selectedCurrency = $gameDetails.val();
    const gamePrice = dataMapping.game[selectedCurrency].price;
    const rangeValue = parseFloat($rangeInput.val());
    const calculatedTotal = (gamePrice * rangeValue) / 10;
    
    $currencyCounter.text(`${calculatedTotal}`);
    $currencyInput.val(calculatedTotal.toFixed(2) / 10);

  }
  
  $rangeInput.on('input', updateRangeBackgroundImage);
  
  $currencyInput.on('input', function () {
    if ($(this).val() === '') return;
  
    const inputValue = parseFloat($(this).val());
    const gamePrice = dataMapping.game[$gameDetails.val()].price;
    const rangeValue = (inputValue * 100) / gamePrice;
    const val = (rangeValue - $rangeInput.attr('min')) / ($rangeInput.attr('max') - $rangeInput.attr('min'));
    const percent = val * 100;
  
    $rangeInput.val(rangeValue);
  
    $rangeInput.css(
      'background-image',
      `-webkit-gradient(linear, left top, right top, 
        color-stop(${percent}%, #46CA43), 
        color-stop(${percent}%, #414D60)`
    );
  
    $rangeInput.css(
      'background-image',
      `-moz-linear-gradient(left center, #46CA43 0%, #46CA43 ${percent}%, #414D60 ${percent}%, #414D60 100%)`
    );

    // Update the currency counter
    updateCurrencyCounter();
  });

  function setIconBasedOnDisabledState($select2Element) {
    $select2Element.find('.select2-selection__arrow').html(iconDefault);
  }

  function setIconBasedOnActiveState($select2Element) {
    $select2Element.next().find('.select2-selection__arrow').html(iconActive);
  }

})(jQuery);
